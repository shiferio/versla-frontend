import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { RestApiService } from '../../rest-api.service';
import { DataService } from '../../data.service';
import { CartService } from '../../cart.service';
import {NgbDateAdapter, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {ModalJoinToJointPurchaseComponent} from '../../modals/modal-join-to-joint-purchase/modal-join-to-joint-purchase.component';
import {ChatService} from '../../chat.service';
import {UploadFileService} from '../../upload-file.service';
import {JointPurchaseHistoryService} from '../../joint-purchase-history.service';
import {CommentModel} from '../comment-elements/comment-model';
import {CommentSettings} from '../comment-elements/comment-settings';

@Injectable()
export class DateNativeAdapter extends NgbDateAdapter<string> {

  fromModel(value: string): NgbDateStruct {
    const date = new Date(value);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  toModel(date: NgbDateStruct): string {
    return new Date(date['year'], date['month'] - 1, date['day']).toDateString();
  }

}

@Component({
  selector: 'app-joint-purchase',
  templateUrl: './joint-purchase.component.html',
  styleUrls: ['./joint-purchase.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: DateNativeAdapter}]
})
export class JointPurchaseComponent implements OnInit {

  private routeSub: Subscription;

  private querySub: Subscription;

  purchaseId: string;

  purchaseInfo: any = {};

  editMode: any = {};

  editModeInfo: any = {};

  additionalTabPane = 'description';

  date = {};

  participants = [];

  history = [];

  visibleHistoryLength = 0;

  blackList = [];

  comments: Array<CommentModel> = [];

  ready = false;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService,
    private cart: CartService,
    private modalService: NgbModal,
    private search: SearchService,
    private spinner: NgxSpinnerService,
    private chatService: ChatService,
    private fileUploader: UploadFileService,
    private purchaseHistoryService: JointPurchaseHistoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.routeSub = this.route.params.subscribe(async (params) => {
      this.purchaseId = params['purchase_id'];

      await this.initialize();

      this.ready = true;
      this.spinner.hide();
    });
  }

  async initialize() {
    const resp = await this.rest.getJointPurchaseById(this.purchaseId);
    await this.loadAdditionalInfo(resp['data']['purchase']);
  }

  get isCreator(): boolean {
    return this.purchaseInfo &&
      this.data.user &&
      this.purchaseInfo['creator']['_id'] === this.data.user['_id'];
  }

  get isParticipant(): boolean {
    if (this.purchaseInfo && this.data.user) {
      const index = this
        .purchaseInfo['participants']
        .findIndex(participant => participant['user'] === this.data.user['_id']);
      return index !== -1;
    } else {
      return false;
    }
  }

  get isBanned(): boolean {
    return this.isLoggedIn &&
      this.purchaseInfo &&
      this.purchaseInfo['black_list'].findIndex(user => user === this.data.user['_id']) !== -1;
  }

  get isOpened(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 0;
    }
  }

  get isCollected(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 1;
    }
  }

  get isClosed(): boolean {
    if (this.purchaseInfo) {
      return this.purchaseInfo['state'] === 2;
    }
  }

  get isLoggedIn(): boolean {
    return !!this.data.user;
  }

  get isPaymentApproved(): boolean {
    if (this.purchaseInfo && this.data.user) {
      const index = this
        .purchaseInfo['participants']
        .findIndex(participant => participant['user'] === this.data.user['_id']);
      if (index !== -1) {
        return this.purchaseInfo['participants'][index]['paid'];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  get haveEnoughRemainingVolume(): boolean {
    return this.purchaseInfo['remaining_volume'] >= this.purchaseInfo['min_volume'];
  }

  get measurementUnit(): string {
    return this.purchaseInfo['measurement_unit']['name'];
  }

  get totalOrderedVolume(): number {
    return this.purchaseInfo['participants'].reduce((all, value) => all + value['volume'], 0);
  }

  get visibleHistory(): Array<any> {
    if (this.visibleHistoryLength === this.history.length) {
      return this.history;
    } else {
      return this.history.slice(0, this.visibleHistoryLength);
    }
  }

  get commentSettings(): CommentSettings {
    const creatorLogin = this.purchaseInfo ? this.purchaseInfo['creator']['login'] : null;
    const canReply = this.isLoggedIn;

    return {
      creatorLogin: creatorLogin,
      canReply: canReply
    };
  }

  showMoreHistoryItems() {
    if (this.visibleHistoryLength + 5 > this.history.length) {
      this.visibleHistoryLength = this.history.length;
    } else {
      this.visibleHistoryLength += 5;
    }
  }

  async loadAdditionalInfo(purchase_info: any) {
    this.purchaseInfo = purchase_info;
    Object.assign(this.editModeInfo, this.purchaseInfo);

    this.participants = await Promise.all(
      this
        .purchaseInfo['participants']
        .map(async (participant) => {
          const data = Object.create(participant);
          if (participant['user']) {
            const resp = await this.rest.getUserById(participant['user']);
            data['user'] = resp['data']['user'];
          }

          data['cost'] = participant['volume'] * this.purchaseInfo['price_per_unit'];
          return data;
      }));

    this.blackList = await Promise.all(
      this.purchaseInfo['black_list']
        .map(async (userId) => {
          const resp = await this.rest.getUserById(userId);
          return resp['data']['user'];
        })
    );

    this.history = [];
    for (const item of this.purchaseInfo['history']) {
      const blocks = await this.purchaseHistoryService.parseHistoryItem(item);
      this.history.push(Object.assign({blocks}, item));
    }
    this.history.reverse();
    this.visibleHistoryLength = Math.min(this.history.length, 5);

    await this.loadTab();
    await this.loadComments();
  }

  async loadComments() {
    this.comments = (await this.rest.getPurchaseCommentTree(this.purchaseInfo['_id']))['data']['comments'];
  }

  async loadTab() {
    this.querySub = this.route.queryParamMap.subscribe(async (params) => {
      const tab = params.get('tab') || this.additionalTabPane;
      if (!this.isCreator && (tab === 'participants' || tab === 'black_list')) {
        await this.switchTab('description');
      } else {
        this.additionalTabPane = tab;
      }
    });
  }

  async purchaseImageChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      try {
        const file = fileList[0];
        const pictureUrl = await this
          .fileUploader
          .uploadImage(file);

        const resp = await this
          .rest
          .updatePurchaseInfo(
            this.purchaseInfo['_id'],
            'picture',
            pictureUrl
          );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateName() {
    if (this.editModeInfo['name']) {
      this.editMode['name'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'name',
          this.editModeInfo['name']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Название закупки не может быть пустой строкой');
    }
  }

  async updateVolume() {
    if (this.editModeInfo['volume']) {
      this.editMode['volume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'volume',
          Number.parseFloat(this.editModeInfo['volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Вы не количество товара');
    }
  }

  async updateMinVolume() {
    if (this.editModeInfo['min_volume']) {
      this.editMode['min_volume'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'min_volume',
          Number.parseFloat(this.editModeInfo['min_volume'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Вы не количество товара');
    }
  }

  async updatePricePerUnit() {
    if (this.editModeInfo['price_per_unit']) {
      this.editMode['price_per_unit'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'price_per_unit',
          Number.parseFloat(this.editModeInfo['price_per_unit'])
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Вы не указали цену');
    }
  }

  async updateDate() {
    if (this.editModeInfo['date']) {
      this.editMode['date'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'date',
          this.editModeInfo['date']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Вы не указали дату');
    }
  }

  async updateIsPublicState() {
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'is_public',
        this.purchaseInfo['is_public']
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateCategory() {
    this.editMode['category'] = false;
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'category',
        this.editModeInfo['category']['_id']
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateDescription() {
    if (this.editModeInfo['description']) {
      this.editMode['description'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'description',
          this.editModeInfo['description']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Нет описания закупки');
    }
  }

  async updateAddress() {
    if (this.editModeInfo['address']) {
      this.editMode['address'] = false;
      try {
        const resp = await this.rest.updatePurchaseInfo(
          this.purchaseInfo['_id'],
          'address',
          this.editModeInfo['address']
        );

        if (resp['meta'].success) {
          this
            .data
            .addToast('Информация обновлена', '', 'success');

          await this.loadAdditionalInfo(resp['data']['purchase']);
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
    } else {
      this
        .data
        .error('Вы не указали адрес места выдачи товара');
    }
  }

  async updateState(newState: number) {
    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'state',
        newState
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updatePaymentInfo() {
    if (
      this.editModeInfo['payment_type'] === 1 &&
      !this.editModeInfo['payment_info'] &&
      this.editModeInfo['payment_info'].length === 0) {
      this
        .data
        .addToast('Укажите платежную информацию', '', 'error');
      return false;
    }

    try {
      const resp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'payment_info',
        this.editModeInfo['payment_info']
      );

      if (!resp['meta'].success) {
        this
          .data
          .error(resp['meta'].message);
        return false;
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
      return false;
    }
    return true;
  }

  async updatePaymentType() {
    if (this.editModeInfo['payment_type'] === 1) {
      const updateInfoRes = await this.updatePaymentInfo();

      if (!updateInfoRes) {
        return;
      }
    }
    try {
      this.editMode['payment_type'] = false;

      const typeResp = await this.rest.updatePurchaseInfo(
        this.purchaseInfo['_id'],
        'payment_type',
        this.editModeInfo['payment_type']
      );

      if (typeResp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(typeResp['data']['purchase']);
      } else {
        this
          .data
          .error(typeResp['meta'].message);
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async joinToPurchase(fakeUser: boolean = false) {
    const modalRef = this.modalService.open(ModalJoinToJointPurchaseComponent);

    modalRef.componentInstance.purchaseInfo = this.purchaseInfo;
    modalRef.componentInstance.fakeUser = fakeUser;

    modalRef.result.then(async (purchaseInfo) => {
      if (purchaseInfo) {
        await this.loadAdditionalInfo(purchaseInfo);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async detachFromPurchase() {
    try {
      const resp = await this.rest.detachFromPurchase(this.purchaseInfo['_id']);

      if (resp['meta'].success) {
        this
          .data
          .addToast('Вы отсоединились от закупки', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .addToast('Не удалось отсоединиться от закупки', '', 'success');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['message'], 'error');
    }
  }

  async detachFakeUserFromPurchase(login: string) {
    try {
      const resp = await this.rest.detachFakeUserFromPurchase(
        this.purchaseInfo['_id'],
        login
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Пользователь отсоединен от закупки', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
      } else {
        this
          .data
          .addToast('Не удалось отсоединиться от закупки', '', 'success');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error['message'], 'error');
    }
  }

  async updatePaymentState(participantId: string, state: boolean) {
    try {
      const resp = await this.rest.updatePaymentPurchase(
        this.purchaseInfo['_id'],
        participantId,
        state
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateFakeUserPaymentState(login: string, state: boolean) {
    try {
      const resp = await this.rest.updateFakeUserPaymentPurchase(
        this.purchaseInfo['_id'],
        login,
        state
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateOrderSentState(participantId: string, state: boolean) {
    try {
      const resp = await this.rest.updateOrderSentPurchase(
        this.purchaseInfo['_id'],
        participantId,
        state
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async updateFakeUserOrderSentState(login: string, state: boolean) {
    try {
      const resp = await this.rest.updateFakeUserOrderSentPurchase(
        this.purchaseInfo['_id'],
        login,
        state
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Информация обновлена', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async openChatWithParticipant(participantId: string) {
    await this.chatService.openNewChat(participantId);
  }

  async openChatWithCreator() {
    await this.chatService.openNewChat(this.purchaseInfo['creator']['_id']);
  }

  async addUserToBlackList(participantId: string) {
    try {
      const resp = await this.rest.addUserToPurchaseBlackList(
        this.purchaseInfo['_id'],
        participantId
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Пользователь добавлен в черный список', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async removeUserFromBlackList(participantId: string) {
    try {
      const resp = await this.rest.removeUserFromPurchaseBlackList(
        this.purchaseInfo['_id'],
        participantId
      );

      if (resp['meta'].success) {
        this
          .data
          .addToast('Пользователь разблокирован', '', 'success');

        await this.loadAdditionalInfo(resp['data']['purchase']);
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

  async onCommentSent() {
    await this.loadComments();
  }

  async switchTab(tab: string) {
    await this.router.navigate([], {
      queryParams: {
        tab: tab
      }
    });
  }

  disableEditMode(field: string) {
    this.editMode[field] = false;
    this.editModeInfo[field] = this.purchaseInfo[field];
  }

  get today(): string {
    return this.data.currentDay;
  }
}
