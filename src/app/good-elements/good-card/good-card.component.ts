import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CartService} from '../../cart.service';
import {DataService} from '../../data.service';
import {ModalDeleteGoodComponent} from '../../modals/modal-delete-good/modal-delete-good.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-good-card',
  templateUrl: './good-card.component.html',
  styleUrls: ['./good-card.component.scss']
})
export class GoodCardComponent implements OnInit {
  @Input('good')
  good: any;

  @Output('onGoodDeleted')
  onGoodDeleted = new EventEmitter();

  constructor(
    private cart: CartService,
    private data: DataService,
    private rest: RestApiService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    if (!this.good.params) {
      const resp = await this.rest.getGoodById(this.good._id);
      this.good = resp['data']['good'];
    }
  }

  async addGoodToCart() {
    const defaultValues = this.good.params.map(param => ({
      name: param.name,
      value: param.values[0]
    }));
    await this.cart.addItemToCart(this.good._id, 1, defaultValues);
    this
      .data
      .addToast('Ура!', 'Товар добавлен в корзину', 'success');
  }

  get isCreator(): boolean {
    if (this.data.user && this.good.creator_id) {
      return this.data.user._id === this.good.creator_id;
    } else {
      return false;
    }
  }

  async confirmGoodDeleting() {
    const name = this.good.name;

    const modalRef = this.modalService.open(ModalDeleteGoodComponent);

    modalRef.componentInstance.name = name;

    modalRef.result.then(async (result) => {
      if (result === 'YES') {
        await this.deleteGood();
      }
    }).catch(error => {
      console.log(error);
    });
  }

  async deleteGood() {
    try {
      const resp = await this.rest.updateGoodInfo(this.good._id, 'available', {
        good_id: this.good._id,
        is_available: false
      });

      if (resp['meta'].success) {
        this
          .data
          .addToast('Ура!', resp['meta'].message, 'success');

        this.onGoodDeleted.emit({
          good_id: this.good._id
        });
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
}
