import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';
import {TagModel} from 'ngx-chips/core/accessor';
import {ModalAddGoodComponent} from '../modals/modal-add-good/modal-add-good.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddParameterComponent} from '../modals/modal-add-parameter/modal-add-parameter.component';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.scss', '../store-elements/store/foundation-themes.scss']
})
export class GoodComponent implements OnInit {
  sub: any;

  good_id: number;

  info: any = {};

  new_tags = [];

  store_info: any = {};

  editMode: any = {};

  available_types = [
    'one', 'two', 'three'
  ];

  additionalTabPane: string;

  commentsForGood = [];

  params = [
    {
      name: 'Size',
      values: [
        'S', 'M', 'L', 'XL', 'XXL'
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private modalService: NgbModal
  ) {
  }

  async ngOnInit() {
    await this.data.getProfile();

    this.sub = this.route.params.subscribe(async (params) => {
      this.good_id = params['good_id'];

      await this.getGoodInfo();
      await this.getCommentsForGood();
      await this.getStoreInfo();
    });

    this.additionalTabPane = 'description';
  }

  async getCommentsForGood() {
    const resp = await this.rest.getCommentsForGood(this.good_id);
    this.commentsForGood = resp['data']['comments'];
  }

  async getGoodInfo() {
    const resp = await this.rest.getGoodById(this.good_id);
    this.info = resp['data']['good'];
    this.info.tags = this.info.tags.filter(item => item != null);
    this.new_tags = this.info.tags.slice();
  }

  async getStoreInfo() {
    const resp = await this.rest.getStoreById(this.info.store_id);
    this.store_info = resp['data']['store'];
  }

  get isCreator(): boolean {
    return this.info && this.data.user && this.info.creator_id === this.data.user._id;
  }

  async updateName() {
    if (this.info.name) {
      try {
        const resp = await this.rest.updateGoodInfo(this.good_id, 'name', {
          good_id: this.good_id,
          name: this.info.name
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          await this.getGoodInfo();

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
        .addToast('Ошибка', 'Название товара не может быть пустой строкой', 'error');
    }
  }

  async updateShortDescription() {
    try {
      this.editMode.short_description = false;
      const resp = await this.rest.updateGoodInfo(this.good_id, 'short_description', {
        good_id: this.good_id,
        short_description: this.info.short_description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getGoodInfo();

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

  async updatePrice() {
    if (this.info.price) {
      try {
        const resp = await this.rest.updateGoodInfo(this.good_id, 'price', {
          good_id: this.good_id,
          price: Number.parseFloat(this.info.price)
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast('Ура!', resp['meta'].message, 'success');

          await this.getGoodInfo();

          this.editMode.price = false;
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
        .addToast('Ошибка', 'Введите цену', 'error');
    }
  }

  async updateDescription() {
    try {
      this.editMode.description = false;
      const resp = await this.rest.updateGoodInfo(this.good_id, 'description', {
        good_id: this.good_id,
        description: this.info.description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getGoodInfo();

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
    this.info.tags = this.new_tags.slice();

    await this
      .rest
      .updateGoodInfo(this.good_id, 'tags', {
        good_id: this.good_id,
        tags: this.info.tags
      });
  }

  async onTagRemoved(event: TagModel) {
    if (this.new_tags.length < 1) {
      this.new_tags = this.info.tags.slice();

      this
        .data
        .addToast('Ошибка', 'Введите хотя бы один тег', 'error');
    } else {
      this.info.tags = this.new_tags.slice();

      await this
        .rest
        .updateGoodInfo(this.good_id, 'tags', {
          good_id: this.good_id,
          tags: this.info.tags
        });
    }
  }

  async updateType() {
    try {
      this.editMode.type = false;
      const resp = await this.rest.updateGoodInfo(this.good_id, 'type', {
        good_id: this.good_id,
        type: this.info.type
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        await this.getGoodInfo();

        this.editMode.type = false;
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

  async goodImageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file, file.name);
      const data = await this.rest.uploadImage(formData);

      try {
        const resp = await this
          .rest
          .updateGoodInfo(this.good_id, 'picture', {
            good_id: this.good_id,
            picture: data['file']
          });

        if (resp['meta'].success) {
          this
            .data
            .success(resp['meta'].message);

          await this.getGoodInfo();
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

  async addGoodToCard(good_id: number) {
    await this.data.addGoodToCart(good_id, 1);
    this
      .data
      .addToast('Ура!', 'Товар добавлен в корзину', 'success');
  }

  async addCommentForGood(info: any) {
    try {

      const resp = await this.rest.addComment({
        title: info.title,
        type: 1,
        text: info.text,
        user_id: this.data.user._id,
        good_id: this.good_id
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

        await this.getCommentsForGood();
      } else {
        this
          .data
          .addToast(resp['meta'].message, '', 'error');
      }
    } catch (error) {
      this
        .data
        .addToast(error['message'], '', 'error');
    }
  }

  openAddParameter() {
    const modalRef = this.modalService.open(ModalAddParameterComponent);

    modalRef.componentInstance.good_id = this.info._id;
    modalRef.componentInstance.available_params = this.info.params;

    modalRef.result.then(async (result) => {
      await this.getGoodInfo();
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}
