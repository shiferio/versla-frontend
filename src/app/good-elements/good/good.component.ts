import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';
import {TagModel} from 'ngx-chips/core/accessor';
import {ModalAddGoodComponent} from '../../modals/modal-add-good/modal-add-good.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalAddParameterComponent} from '../../modals/modal-add-parameter/modal-add-parameter.component';
import {CartService} from '../../cart.service';
import {SearchService} from '../../search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {Title} from '@angular/platform-browser';
import {UploadFileService} from '../../upload-file.service';
import {ModalAddJointPurchaseComponent} from '../../modals/modal-add-joint-purchase/modal-add-joint-purchase.component';
import {ModalGoodPurchaseChooserComponent} from '../../modals/modal-good-purchase-chooser/modal-good-purchase-chooser.component';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.scss', '../../store-elements/store/foundation-themes.scss']
})
export class GoodComponent implements OnInit {
  sub: any;

  good_id: string;

  info: any;

  rating: number;

  new_tags = [];

  store_info: any = {};

  editMode: any = {};

  additionalTabPane: string;

  commentsForGood = [];

  userParams = {};

  unavailable = false;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private cart: CartService,
    private modalService: NgbModal,
    private search: SearchService,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private fileUploader: UploadFileService
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    await this.data.getProfile();


    this.sub = this.route.params.subscribe(async (params) => {
      this.good_id = params['good_id'];

      await this.getGoodInfo();
      if (!this.unavailable) {
        await this.getCommentsForGood();
        await this.getStoreInfo();
      }

    });
    this.spinner.hide();
    this.additionalTabPane = 'description';
  }

  get isCommented(): boolean {
    if (this.isRegistered) {
      const count = this.commentsForGood.length;

      for (let i = 0; i < count; i++) {
        if (this.commentsForGood[i].creator_id._id === this.data.user._id) {
          return true;
        }
      }
    }

    return false;
  }

  get isWritingAvailable(): boolean {
    return !this.isCommented && this.isRegistered;
  }

  async getCommentsForGood() {
    const resp = await this.rest.getCommentsForGood(this.info._id);
    this.commentsForGood = resp['data']['comments'];
  }

  async getGoodInfo() {
    const resp = await this.rest.getGoodById(this.good_id);
    this.info = resp['data']['good'];
    if (this.info) {
      this.rating = this.info.rating;
      this.info.tags = this.info.tags.filter(item => item != null);
      this.new_tags = this.info.tags.slice();
      await this.getStoreInfo();
      this.data.setTitle(this.info.name + ' - ' + this.store_info.name);
    } else {
      this.unavailable = true;
      this.data.setTitle('Товар не найден');
    }
  }

  async getStoreInfo() {
    const resp = await this.rest.getStoreById(this.info.store_id);
    this.store_info = resp['data']['store'];
  }

  get isCreator(): boolean {
    return this.info &&
      this.data.user &&
      this.info.creator_id &&
      this.info.creator_id._id === this.data.user._id;
  }

  get isRegistered(): boolean {
    return this.info && this.data.user !== null && this.data.user !== undefined;
  }

  async updateRating() {
    if (this.info.rating) {
      try {
        console.log(this.rating);
        const resp = await this.rest.updateGoodInfo(this.info._id, 'rating', {
          good: this.info._id,
          rate: this.rating
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast(resp['meta'].message, '', 'success');

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
  async updateName() {
    if (this.info.name) {
      try {
        const resp = await this.rest.updateGoodInfo(this.info._id, 'name', {
          good_id: this.info._id,
          name: this.info.name
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast(resp['meta'].message, '', 'success');

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
      const resp = await this.rest.updateGoodInfo(this.info._id, 'short_description', {
        good_id: this.info._id,
        short_description: this.info.short_description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

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
        const resp = await this.rest.updateGoodInfo(this.info._id, 'price', {
          good_id: this.info._id,
          price: Number.parseFloat(this.info.price)
        });

        if (resp['meta'].success) {
          this
            .data
            .addToast(resp['meta'].message, '', 'success');

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
      const resp = await this.rest.updateGoodInfo(this.info._id, 'description', {
        good_id: this.info._id,
        description: this.info.description
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

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
      .updateGoodInfo(this.info._id, 'tags', {
        good_id: this.info._id,
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
        .updateGoodInfo(this.info._id, 'tags', {
          good_id: this.info._id,
          tags: this.info.tags
        });
    }
  }

  async updateCategory(category: any) {
    this.info.category = category;
    try {
      this.editMode.category = false;
      const resp = await this.rest.updateGoodInfo(this.info._id, 'category', {
        good_id: this.info._id,
        category: this.info.category._id
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast(resp['meta'].message, '', 'success');

        await this.getGoodInfo();

        this.editMode.category = false;
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
      try {
        const file = fileList[0];
        const pictureUrl = await this
          .fileUploader
          .uploadImage(file);

        const resp = await this
          .rest
          .updateGoodInfo(this.info._id, 'picture', {
            good_id: this.info._id,
            picture: pictureUrl
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
    const values = [];
    for (const param of this.info.params) {
      if (this.userParams[param.name]) {
        values.push({
          name: param.name,
          value: this.userParams[param.name]
        });
      } else {
        values.push({
          name: param.name,
          value: param.values[0]
        });
      }
    }
    await this.cart.addItemToCart(this.info._id, 1, values);
    this
      .data
      .addToast('Товар добавлен в корзину', '', 'success');
  }

  async addCommentForGood(commentInfo: any) {
    try {
      console.log({
        title: commentInfo.title,
        rating: commentInfo.rating,
        type: 1,
        text: commentInfo.text,
        good_id: this.info._id
      });
      const resp = await this.rest.addComment({
        title: commentInfo.title,
        rating: commentInfo.rating,
        type: 1,
        text: commentInfo.text,
        good_id: this.info._id
      });

      console.log('h2');

      if (resp['meta'].success) {
        console.log(resp);
        this
          .data
          .addToast('Комментарий успешно добавлен!', '', 'success');

        await this.getCommentsForGood();
      } else {
        this
          .data
          .addToast('Не удалось добавить комментарий', '', 'error');
      }
    } catch (error) {
      this
        .data
        .addToast(error['message'], '', 'error');
    }
  }

  openAddParameter() {
    const modalRef = this.modalService.open(ModalAddParameterComponent);

    modalRef.componentInstance._id = this.info._id;
    modalRef.componentInstance.available_params = this.info.params;

    modalRef.result.then(async (result) => {
      await this.getGoodInfo();
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openStoreAndCategorySearch() {
    this.search.reset();
    this.search.category = this.info.category;
    this.search.store = { '_id': this.store_info._id };
    this.search.city = { '_id': this.info.city };
    this.search.navigate();
  }

  openAddJointPurchase() {
    const modalRef = this.modalService.open(
      ModalAddJointPurchaseComponent,
      {
        size: 'lg'
      }
    );

    modalRef.componentInstance.good = this.info;

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  openJoinToJointPurchase() {
    const modalRef = this.modalService.open(
      ModalGoodPurchaseChooserComponent,
      {
        size: 'lg'
      });

    modalRef.componentInstance.good = this.info;

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}
