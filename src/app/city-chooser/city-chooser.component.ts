import {Component, forwardRef, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-city-chooser',
  templateUrl: './city-chooser.component.html',
  styleUrls: ['./city-chooser.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityChooserComponent),
      multi: true
    }
  ]
})
export class CityChooserComponent implements OnInit, ControlValueAccessor {

  dropdown_menu = false;

  cities: Array<any>;

  new_city_name: string;

  selected_city = {};

  onChange = (value: any) => {};

  onTouch = () => {};

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    const resp = await this.rest.getAllCities();
    this.cities = resp['data']['cities'];
  }

  selectCity(city: any) {
    this.selected_city = city;
    this.hideMenu();
    this.onChange(this.selected_city);
  }

  toggleMenu() {
    this.dropdown_menu = !this.dropdown_menu;
    this.onTouch();
  }

  hideMenu() {
    this.dropdown_menu = false;
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

  get value() {
    return this.selected_city;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    if (obj && obj.name && obj.location) {
      this.selectCity(obj);
    }
  }
}
