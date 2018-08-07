import {Injectable} from '@angular/core';
import {RestApiService} from './rest-api.service';

export class TextBlock {
  constructor(
    public readonly text: string,
    public readonly bold: boolean
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class JointPurchaseHistoryService {

  public readonly purchaseParameters = [
    'name', 'picture', 'description', 'category', 'volume', 'min_volume', 'price_per_unit'
  ];

  public readonly paymentParameters = [
    'payment_type', 'payment_info'
  ];

  public readonly purchaseState = ['state'];

  public readonly participantParameters = [
    'participants.sent', 'participants.paid', 'participants.delivered'
  ];

  public readonly participantActivity = [
    'participants.joint', 'participants.detached'
  ];

  constructor(
    private rest: RestApiService
  ) { }

  private async getCategory(id: string) {
    try {
      const resp = await this.rest.getGoodCategoryById(id);
      return resp['data']['category']['name'];
    } catch (error) {
      return '';
    }
  }

  private async getUser(id: string) {
    try {
      const resp = await this.rest.getUserById(id);
      return resp['data']['user'];
    } catch (error) {
      return {};
    }
  }

  private async parsePurchaseParameter(item: any): Promise<Array<TextBlock>> {
    const parameter = item['parameter'];
    const value = item['value'];
    switch (parameter) {
      case 'name':
        return [
          { text: 'Организатор изменил название закупки на ', bold: false },
          { text: value.toString(), bold: true }
        ];
      case 'picture':
        return [
          { text: 'Организатор изменил изображение товара', bold: false }
        ];
      case 'description':
        return [
          { text: 'Организатор изменил описание закупки', bold: false }
        ];
      case 'category':
        const categoryName = await this.getCategory(value);
        return [
          { text: 'Организатор изменил категорию товара на ', bold: false },
          { text: categoryName, bold: true }
        ];
      case 'volume':
        return [
          { text: 'Организатор изменил количество товара: ', bold: false },
          { text: `${value['volume']} ${value['measurement_unit']}`, bold: true }
        ];
      case 'min_volume':
        return [
          { text: 'Организатор изменил минимальный объем закупки: ', bold: false },
          { text: `${value['volume']} ${value['measurement_unit']}`, bold: true }
        ];
      case 'price_per_unit':
        return [
          { text: 'Организатор изменил цену: ', bold: false },
          { text: `${value} ₽`, bold: true }
        ];
    }
  }

  private parsePurchaseState(item: any): Array<TextBlock> {
    const value = item['value'];
    switch (value) {
      case 0:
        return [
          { text: 'Организатор объявил об ', bold: false },
          { text: 'открытии закупки', bold: true }
        ];
      case 1:
        return [
          { text: 'Организатор объявил о ', bold: false },
          { text: 'завершении приема заказов', bold: true }
        ];
      case 2:
        return [
          { text: 'Организатор объявил о ', bold: false },
          { text: 'закрытии закупки', bold: true }
        ];
    }
  }

  private parsePaymentParameter(item: any): Array<TextBlock> {
    const parameter = item['parameter'];
    switch (parameter) {
      case 'payment_type':
        return [
          {text: 'Организатор изменил ', bold: false},
          {text: 'способ оплаты', bold: true}
        ];
      case 'payment_info':
        return [
          {text: 'Организатор обновил ', bold: false},
          {text: 'данные для платежей', bold: true}
        ];
    }
  }

  private async parseParticipantParameter(item: any): Promise<Array<TextBlock>> {
    const parameter = item['parameter'];
    const {user: userId, state} = item['value'];

    const user = await this.getUser(userId);
    if (parameter === 'participants.sent') {
      const textState = state ? 'отправлен' : 'не отправлен';
      return [
        { text: 'Организатор обновил статус отправки товара для ', bold: false},
        { text: `${user['login']}: ${textState}`, bold: true}
      ];
    } else if (parameter === 'participants.paid') {
      const textState = state ? 'платеж подтвержден' : 'платеж не подтвержден';
      return [
        { text: 'Организатор обновил статус платежа пользователя ', bold: false},
        { text: `${user['login']}: ${textState}`, bold: true}
      ];
    } else if (parameter === 'participants.delivered') {
      const textState = state ? 'доставлен' : 'не доставлен';
      return [
        { text: 'Пользователь ', bold: false},
        { text: user['login'], bold: true},
        { text: ' обновил статус доставки товара: ', bold: false},
        { text: `${textState}`, bold: true}
      ];
    }
  }

  private async parseParticipantActivity(item: any): Promise<Array<TextBlock>> {
    const parameter = item['parameter'];
    const {user: userId} = item['value'];

    const user = await this.getUser(userId);
    if (parameter === 'participants.joint') {
      return [
        { text: 'Пользователь ', bold: false},
        { text: `${user['login']}`, bold: true},
        { text: ' присоединился к закупке', bold: false}
      ];
    } else if (parameter === 'participants.detached') {
      return [
        { text: 'Пользователь ', bold: false},
        { text: `${user['login']}`, bold: true},
        { text: ' отказался от участия в закупке', bold: false}
      ];
    }
  }

  async parseHistoryItem(item: any): Promise<Array<TextBlock>> {
      if (this.purchaseParameters.indexOf(item['parameter']) !== -1) {
        return await this.parsePurchaseParameter(item);
      } else if (this.paymentParameters.indexOf(item['parameter']) !== -1) {
        return this.parsePaymentParameter(item);
      } else if (this.purchaseState.indexOf(item['parameter']) !== -1) {
        return this.parsePurchaseState(item);
      } else if (this.participantParameters.indexOf(item['parameter']) !== -1) {
        return await this.parseParticipantParameter(item);
      } else if (this.participantActivity.indexOf(item['parameter']) !== -1) {
        return await this.parseParticipantActivity(item);
      }
  }
}
