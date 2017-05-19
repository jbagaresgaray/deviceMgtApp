import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';


import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var chrome: any;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  _platform: string;
  public details: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private device: Device, private geolocation: Geolocation,
    private appVersion: AppVersion, private zone: NgZone, private file: File) {

    this.platform.ready().then((readySource) => {
      let ctrl: any = this;

      this.zone.run(() => {
        if (this.platform.is('ios')) {
          this._platform = 'iOS';
        } else if (this.platform.is('android')) {
          this._platform = 'Android';
        } else if (this.platform.is('windows')) {
          this._platform = 'Windows';
        }
        this.details._platform = this._platform;
        this.details.storageSize = 0;

        this.details.UUID = this.device.uuid;
        this.details.serial = this.device.serial
        this.details.model = this.device.model;
        this.details.platform = this.device.platform;
        this.details.version = this.device.version;
        this.details.manufacturer = this.device.manufacturer;
        this.details.screenResolution = this.platform.width() + 'x' + this.platform.height();
      });

      this.geolocation.getCurrentPosition().then((resp) => {
        let coords = resp.coords;
        ctrl.zone.runOutsideAngular(() => {
          console.log('latitude: ', coords.latitude)
          console.log('latitude: ', coords.longitude)
          ctrl.details.latitude = coords.latitude;
          ctrl.details.longitude = coords.longitude;
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      if (this.platform.is('cordova')) {
        this.appVersion.getAppName().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.appName = name;
          });
        });

        this.appVersion.getPackageName().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.packageName = name;
          });
        });

        this.appVersion.getVersionCode().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.versionCode = name;
          });
        });

        this.appVersion.getVersionNumber().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.versionNumber = name;
          });
        });

        window['MacAddress'].getMacAddress(
          function (macAddress) {
            ctrl.zone.runOutsideAngular(() => {
              ctrl.details.macAddress = macAddress;
            });
          }, function (fail) {
            console.log('mac Address err: ', fail);
          }
        );

        chrome.system.memory.getInfo((data) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.ram = data.capacity;
          });
        });

        this.file.getFreeDiskSpace().then((data) => {
          console.log('getFreeDiskSpace: ', data);
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.storageSize = data;
          });
        });
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  validateKeys() {
    // this.navCtrl.push(HomePage);
    console.log('Device: ', this.details);
  }

  refresh() {
    this.platform.ready().then((readySource) => {
      let ctrl: any = this;

      this.zone.run(() => {
        if (this.platform.is('ios')) {
          this._platform = 'iOS';
        } else if (this.platform.is('android')) {
          this._platform = 'Android';
        } else if (this.platform.is('windows')) {
          this._platform = 'Windows';
        }
        this.details._platform = this._platform;
        this.details.storageSize = 0;

        this.details.UUID = this.device.uuid;
        this.details.serial = this.device.serial
        this.details.model = this.device.model;
        this.details.platform = this.device.platform;
        this.details.version = this.device.version;
        this.details.manufacturer = this.device.manufacturer;
        this.details.screenResolution = this.platform.width() + 'x' + this.platform.height();
      });

      this.geolocation.getCurrentPosition().then((resp) => {
        let coords = resp.coords;
        ctrl.zone.runOutsideAngular(() => {
          console.log('latitude: ', coords.latitude)
          console.log('latitude: ', coords.longitude)
          ctrl.details.latitude = coords.latitude;
          ctrl.details.longitude = coords.longitude;
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      if (this.platform.is('cordova')) {
        this.appVersion.getAppName().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.appName = name;
          });
        });

        this.appVersion.getPackageName().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.packageName = name;
          });
        });

        this.appVersion.getVersionCode().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.versionCode = name;
          });
        });

        this.appVersion.getVersionNumber().then((name) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.versionNumber = name;
          });
        });

        window['MacAddress'].getMacAddress(
          function (macAddress) {
            ctrl.zone.runOutsideAngular(() => {
              ctrl.details.macAddress = macAddress;
            });
          }, function (fail) {
            console.log('mac Address err: ', fail);
          }
        );

        chrome.system.memory.getInfo((data) => {
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.ram = data.capacity;
          });
        });

        this.file.getFreeDiskSpace().then((data) => {
          console.log('getFreeDiskSpace: ', data);
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.storageSize = data;
          });
        });
      }

    });

  }

}
