import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-city-chooser',
  templateUrl: './city-chooser.component.html',
  styleUrls: ['./city-chooser.component.scss']
})
export class CityChooserComponent implements OnInit {

  menu_visible = false;

  cities: Array<any>;

  new_city_name: string;

  selected_city = {};

  @Output('cityChanged')
  cityChanged = new EventEmitter();

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  get city(): any {
    return this.selected_city;
  }

  @Input('city')
  set city(city: any) {
    this.selected_city = city || this.selected_city;
  }

  async ngOnInit() {
    const resp = await this.rest.getAllCities();
    this.cities = resp['data']['cities'];
  }

  selectCity(city: any) {
    this.hideMenu();
    if (this.selected_city['_id'] !== city['_id']) {
      this.selected_city = city;
      this.cityChanged.emit(this.selected_city);
    }
  }

  toggleMenu() {
    this.menu_visible = !this.menu_visible;
  }

  hideMenu() {
    this.menu_visible = false;
  }

  async addNewCity() {
    const index = this.cities.findIndex(city => city.name === this.new_city_name);
    if (index !== -1) {
      this
        .data
        .addToast('Ошибка', 'Такой город уже есть. Добавьте название региона в скобках', 'error');
      return;
    }
    try {
      const resp = await this.rest.addCity({
        name: this.new_city_name,
        location: {
          lat: 0, lng: 0
        }
      });

      if (resp['meta'].success) {
        this.cities.push(resp['data']['city']);
        this.new_city_name = '';
        this.selectCity(this.cities[this.cities.length - 1]);
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error.toString(), 'error');
    }
  }

}
