import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {DataService} from '../data.service';
import {TagModel} from 'ngx-chips/core/accessor';

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

  commentsForGood = [
    {
      'rating': 2,
      '_id': '5b2b9c252b0ea00b39fb6347',
      'created': '2018-06-21T12:37:57.846Z',
      'creator_id': '5b215a9b719645637b7b939d',
      'text': 'The breakthrough revolutionary product',
      'title': 'Amazing good',
      'good_id': '5b27bce94de6a514b4cf1462',
      '__v': 0
    },
    {
      'rating': 6,
      '_id': '5b2b9c8d5ba2440b4d3740db',
      'created': '2018-06-21T12:39:41.686Z',
      'creator_id': '5b215a9b719645637b7b939d',
      'text': 'The breakthrough revolutionary product',
      'title': 'Amazing good',
      'type': 1,
      'good_id': '5b27bce94de6a514b4cf1462',
      '__v': 0
    }
  ]; //[];

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService
  ) {
  }

  async ngOnInit() {
    await this.data.getProfile();

    this.sub = this.route.params.subscribe(async (params) => {
      this.good_id = params['good_id'];

      await this.getGoodInfo();
      // await this.getCommentsForGood();
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
}
