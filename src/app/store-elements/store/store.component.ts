import {Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {TagModel} from 'ngx-chips/core/accessor';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddStoreComponent} from '../../modals/modal-add-store/modal-add-store.component';
import {ModalAddGoodComponent} from '../../modals/modal-add-good/modal-add-good.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss', './foundation-themes.scss']
})
export class StoreComponent implements OnInit, OnDestroy {
  @ViewChild('mapElement')
  mapElement: ElementRef;

  @ViewChild('inputElement')
  inputElement: ElementRef;

  map: any;

  address: string;

  location: any;

  link: string;

  info: any;

  editMode: any = {};

  new_user_login: string;

  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal
    ) {
  }

  async getStoreInfo(storeLink: string) {
    const storeInfo = await this.rest.getStore(storeLink);
    if (storeInfo['meta'].success) {
      this.info = storeInfo['data'].store;
      this.info.tags = this.info.tags.map(item => ({display: item, value: item}));

      const faces = [];
      for (const face of this.info.contact_faces) {
        const data = await this.rest.getUserById(face);
        const user = data['data'].user;

        faces.push({
          id: face,
          name: user.first_name || user.login || 'No name'
        });
      }

      this.info.contact_faces = faces;

      this.location = {
        lat: this.info.location.lat,
        lng: this.info.location.lng
      };
    }
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      this.link = params['link'];
      await this.getStoreInfo(this.link);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async deleteLogo() {
    this.editMode.logo = true;

    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'logo', {
        link: this.link,
        logo: ''
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        this.getStoreInfo(this.link);
        this.editMode.logo = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }

    this.editMode.logo = false;
  }

  async deleteBackground() {
    this.editMode.background = true;

    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'background', {
        link: this.link,
        background: ''
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getStoreInfo(this.link);
        this.editMode.logo = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }

    this.editMode.background = false;
  }

  async logoChange(event) {
    this.editMode.logo = true;

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);

      const data = await this.rest.uploadImage(formData);

      try {
        const resp = await this.rest.updateStoreInfo(this.link, 'logo', {
          link: this.link,
          logo: data['file']
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          await this.getStoreInfo(this.link);
          this.editMode.logo = false;
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['meta'].message, 'error');
      }
    }

    this.editMode.logo = false;
  }

  async backgroundChange(event) {
    this.editMode.background = true;

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);

      const data = await this.rest.uploadImage(formData);

      try {
        const resp = await this.rest.updateStoreInfo(this.link, 'background', {
          link: this.link,
          background: data['file']
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          await this.getStoreInfo(this.link);
          this.editMode.background = false;
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['meta'].message, 'error');
      }
    }

    this.editMode.background = false;
  }

  async updateStoreName() {
    if (this.info.name) {
      try {
        const resp = await this.rest.updateStoreInfo(this.link, 'name', {
          link: this.link,
          name: this.info.name
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          await this.getStoreInfo(this.link);
          this.editMode.name = false;
        } else {
          this
            .data
            .addToast('Ошибка', resp['meta'].message, 'error');
        }
      } catch (error) {
        this
          .data
          .addToast('Ошибка', error['meta'].message, 'error');
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Имя магазина не может быть пустой строкой', 'error');
    }
  }

  async updateShortDescription() {
    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'short_description', {
        link: this.link,
        short_description: this.info.short_description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getStoreInfo(this.link);
        this.editMode.short_description = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  async updateDescription() {
    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'description', {
        link: this.link,
        description: this.info.description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getStoreInfo(this.link);
        this.editMode.description = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  async onTagAdded(event: TagModel) {
    await this
      .rest
      .updateStoreInfo(this.link, 'tags', {
        link: this.link,
        tags: this.info.tags.map(item => item.value)
      });
  }

  async onTagRemoved(event: TagModel) {
    await this
      .rest
      .updateStoreInfo(this.link, 'tags', {
        link: this.link,
        tags: this.info.tags.map(item => item.value)
      });
  }

  async deleteFace(face) {
    if (this.info.contact_faces.length > 1) {
      for (let i = this.info.contact_faces.length - 1; i >= 0; i--) {
        if (this.info.contact_faces[i].id === face) {
          this.info.contact_faces.splice(i, 1);
        }
      }

      await this.updateContactFaces();
    } else {
      this
        .data
        .addToast('Ошибка', 'Должно быть хотя бы одно контактное лицо', 'error');
    }
  }

  async addNewUserByLogin() {
    try {
      const data = await this.rest.getUserByLogin(this.new_user_login);

      if (data['meta'].success) {

        const user = data['data'].user;

        for (const face of this.info.contact_faces) {
          if (face.id === user._id) {
            this
              .data
              .addToast('Ошибка', 'Пользователь уже есть', 'error');
            return;
          }
        }

        this.info.contact_faces.push({
          id: user._id,
          name: user.first_name || user.login
        });

        await this.updateContactFaces();
      } else {
        this
          .data
          .addToast('Ошибка', data['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  async updateContactFaces() {
    const faces = this.info.contact_faces.map(face => face.id);

    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'contact_faces', {
        link: this.link,
        contact_faces: faces
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  async updateLocation() {
    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'location', {
        link: this.link,
        location: this.location
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getStoreInfo(this.link);
        this.editMode.location = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }

    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'contacts', {
        link: this.link,
        address: this.address
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getStoreInfo(this.link);
        this.editMode.name = false;
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['meta'].message, 'error');
    }
  }

  get isCreator(): boolean {
    return this.info.creator_id === this.data.user._id;
    // return false;
  }


  addressChanged(event: any) {
    console.log(event);
    const {response, data} = event;
    if (response) {
      this.location = data.geometry.location;
      this.address = data.description;
    }
  }

  openAddGood() {
    const modalRef = this.modalService.open(ModalAddGoodComponent);

    modalRef.componentInstance.store_id = this.info._id;

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}
