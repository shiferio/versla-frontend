import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {TagModel} from 'ngx-chips/core/accessor';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddGoodComponent} from '../../modals/modal-add-good/modal-add-good.component';
import {CartService} from '../../cart.service';
import {ModalEditStoreCredentialsComponent} from '../../modals/modal-edit-store-credentials/modal-edit-store-credentials.component';
import {ModalEditStoreContactsComponent} from '../../modals/modal-edit-store-contacts/modal-edit-store-contacts.component';
import {SearchService} from '../../search.service';
import {ScopeModel, SearchFieldService} from '../../search-field.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ChatService} from '../../chat.service';
import {UploadFileService} from '../../upload-file.service';

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

  location: any = {};

  link: string;

  info: any = {};

  goods: any = [];

  editMode: any = {};

  new_user_login: string;

  private sub: any;

  private storeScope = new ScopeModel(
    'В этом магазине',
    this.search,
    search => {
      search.store = { _id: this.info._id };
      search.city = this.info.city;
    }
  );

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private cart: CartService,
    private modalService: NgbModal,
    private search: SearchService,
    private searchField: SearchFieldService,
    private spinner: NgxSpinnerService,
    private chatService: ChatService,
    private fileUploader: UploadFileService
  ) {
  }

  async getStoreInfo(storeLink: string) {
    const storeInfo = await this.rest.getStoreByLink(storeLink);
    if (storeInfo['meta'].success) {
      this.info = storeInfo['data'].store;
      this.data.setTitle(this.info.name);
      this.info.tags = this.info.tags.map(item => ({display: item, value: item}));
      const storeGoods = await this.rest.getGoodsByStoreId(this.info._id);

      if (storeGoods['meta'].success) {
        this.goods = storeGoods['data'].goods;
      }

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

  get storeId() {
    return this.info._id;
  }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(async (params) => {
      this.spinner.show();

      this.link = params['link'];
      await this.getStoreInfo(this.link);

      this.searchField.setStoreScope(this.storeScope);
      this.searchField.activeScope = this.storeScope;

      this.spinner.hide();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.searchField.deleteStoreScope();
  }

  async deleteLogo() {
    this.editMode.logo = true;

    try {
      await this.rest.updateStoreInfo(this.link, 'logo', {
        link: this.link,
        logo: ''
      });

      this
        .data
        .success('Логотип удален');

      await this.getStoreInfo(this.link);
    } catch (error) {
      this
        .data
        .error(error['message']);
    }

    this.editMode.logo = false;
  }

  async deleteBackground() {
    this.editMode.background = true;

    try {
      await this.rest.updateStoreInfo(this.link, 'background', {
        link: this.link,
        background: ''
      });

      this
        .data
        .success('Фоновое изображение удалено');

      await this.getStoreInfo(this.link);
    } catch (error) {
      this
        .data
        .error(error['message']);
    }

    this.editMode.background = false;
  }

  async logoChange(event) {
    this.editMode.logo = true;

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const pictureUrl = await this
        .fileUploader
        .uploadImage(file);

      try {
        await this.rest.updateStoreInfo(this.link, 'logo', {
          link: this.link,
          logo: pictureUrl
        });

        this
          .data
          .success('Логотип обновлен');

        await this.getStoreInfo(this.link);
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }

    this.editMode.logo = false;
  }

  async backgroundChange(event) {
    this.editMode.background = true;

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const pictureUrl = await this
        .fileUploader
        .uploadImage(file);

      try {
        await this.rest.updateStoreInfo(this.link, 'background', {
          link: this.link,
          background: pictureUrl
        });

        this
          .data
          .success('Фоновое изображение обновлено');

        await this.getStoreInfo(this.link);
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }

    this.editMode.background = false;
  }

  async updateStoreName() {
    if (this.info.name) {
      try {
        await this.rest.updateStoreInfo(this.link, 'name', {
          link: this.link,
          name: this.info.name
        });

        this
          .data
          .success('Информация обновлена');

        await this.getStoreInfo(this.link);
        this.editMode.name = false;
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    } else {
      this
        .data
        .addToast('Введите имя магазина', '', 'error');
    }
  }

  async updateShortDescription() {
    try {
      await this.rest.updateStoreInfo(this.link, 'short_description', {
        link: this.link,
        short_description: this.info.short_description
      });

      this
        .data
        .success('Информация обновлена');

      await this.getStoreInfo(this.link);
      this.editMode.short_description = false;
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updateDescription() {
    try {
      await this.rest.updateStoreInfo(this.link, 'description', {
        link: this.link,
        description: this.info.description
      });

      this
        .data
        .success('Информация обновлена');

      await this.getStoreInfo(this.link);
      this.editMode.description = false;
    } catch (error) {
      this
        .data
        .error(error['message']);
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

  async updateLocation() {
    try {
      const resp = await this.rest.updateStoreInfo(this.link, 'location', {
        link: this.link,
        location: this.location
      });

      this
        .data
        .success('Информация обновлена');

      await this.getStoreInfo(this.link);
      this.editMode.location = false;
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  get isCreator(): boolean {
    return this.info && this.data.user && this.info.creator_id === this.data.user._id;
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
    modalRef.componentInstance.city_id = this.info.city._id;

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  async onGoodDeleted(good_info: any) {
    await this.getStoreInfo(this.link);
  }

  openEditStoreCredentials() {
    const modalRef = this.modalService.open(ModalEditStoreCredentialsComponent);

    modalRef.componentInstance.storeInfo = this.info;

    modalRef.result.then( async () => {
      await this.getStoreInfo(this.link);
    }).catch(() => {});
  }

  openEditStoreContacts() {
    const modalRef = this.modalService.open(ModalEditStoreContactsComponent);

    modalRef.componentInstance.contacts = this.info.contacts;
    modalRef.componentInstance.link = this.info.link;
    modalRef.componentInstance.city = this.info.city;

    modalRef.result.then( async () => {
      await this.getStoreInfo(this.link);
    }).catch(() => {});
  }

  openStoreSearch() {
    this.searchField.activeScope = this.storeScope;
    this.searchField.activeScope.applyFilters();
    this.searchField.activeScope.search.navigate();
  }

  async openChat() {
    await this.chatService.openNewChat(this.info.creator_id);
  }
}
