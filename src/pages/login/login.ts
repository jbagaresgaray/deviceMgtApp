import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import * as async from 'async';
import * as io from 'socket.io-client';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';

import { DeviceProvider } from '../../providers/device/device';
import { HomePage } from '../home/home';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var chrome: any;
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  _platform: string;
  public details: any = {};
  public deviceObj: any = {};
  socket: any;
  appTimer: any;
  isPingEnable:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private device: Device, private geolocation: Geolocation,
    private appVersion: AppVersion, private zone: NgZone, private file: File, private deviceFctry: DeviceProvider, public toastr: ToastController) {
    
    var SOCKET_URL = deviceFctry.apiUrl;
    console.log('SOCKET_URL: ',SOCKET_URL);

    this.socket = io(SOCKET_URL);
    this.socket.on('connect', (socket) => {
      console.log('--socket.io ',socket);
    });

    this.refresh();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.details.accesscode = '958441082755103';
  }

  ionViewDidLeave() {
    this.socket.emit("device:ping:stop", this.deviceObj);
    this.socket.emit("deviceDisconnect", this.deviceObj);
  }

  pingApp() {
    console.log('DateNow: ', Date.now());
    var timeInMs = Date.now();
    this.deviceObj.startTime = timeInMs;

    this.isPingEnable = false;
    this.appTimer = setInterval(() => {
      console.log('device:ping:send: ', this.deviceObj);
      this.socket.emit('device:ping:send', this.deviceObj);
    }, 1000);

    setTimeout(() => {
      console.log('stop ping');
      clearInterval(this.appTimer);
      this.isPingEnable = true;
    }, 5000);
  }

  connectApp(){
    this.deviceObj = {
      uuid: this.details.UUID,
      name: this.details.name,
      brand: this.details.manufacturer,
      model: this.details.model,
      serial: this.details.serial,
      osname: this.details.platform,
      osversion: this.details.version,
      screensreso: this.details.screenResolution,
      ram: this.details.ram,
      storage: this.details.storageSize,
      mac_address: this.details.macAddress,
      buildVersion: this.details.versionNumber,
      latitude: this.details.latitude,
      longitude: this.details.longitude,
      accesscode: this.details.accesscode,
      isOnline: true
    };

    console.log('deviceConnect: ', this.deviceObj);
    this.socket.emit("deviceConnect", this.deviceObj);
  }

  validateKeys() {
    console.log('Device: ', this.details);
    this.deviceObj = {
      uuid: this.details.UUID,
      name: this.details.name,
      brand: this.details.manufacturer,
      model: this.details.model,
      serial: this.details.serial,
      osname: this.details.platform,
      osversion: this.details.version,
      screensreso: this.details.screenResolution,
      ram: this.details.ram,
      storage: this.details.storageSize,
      mac_address: this.details.macAddress,
      buildVersion: this.details.versionNumber,
      latitude: this.details.latitude,
      longitude: this.details.longitude,
      accesscode: this.details.accesscode,
      isOnline: true
    };
    console.log('Device 1: ', this.deviceObj);

    async.waterfall([
      (callback) => {
        this.deviceFctry.validateDevice(this.deviceObj).then((resp) => {
          if (resp.statusCode == 200 && resp.response.success) {
            callback();
          } else {
            let toast = this.toastr.create({
              message: resp.response.msg,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
        }).catch(err => {
          var error = JSON.parse(err._body);
          console.log('error: ', error)
          if (error.statusCode == 400 && !error.response.success && _.isArray(error.response.result)) {
            console.log('loop error')
          }
        });
      },
      (callback) => {
        this.deviceFctry.registerDevice(this.deviceObj).then((resp) => {
          if (resp.statusCode == 200 && resp.response.success) {
            callback();
          } else {
            let toast = this.toastr.create({
              message: resp.response.msg,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
        }).catch(err => {
          var error = JSON.parse(err._body);
          console.log('error: ', error)
          if (error.statusCode == 400 && !error.response.success && _.isArray(error.response.result)) {
            console.log('loop error')
          }
        });
      }
    ]);
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
        this.details.UUID = this.device.uuid || '27f33bc5-3eec-11e7';
        this.details.serial = this.device.serial || 'A8AZCY16C957'
        this.details.model = this.device.model || 'All Series';
        this.details.platform = this.device.platform || window.navigator.platform;
        this.details.version = this.device.version || '0.0.1';
        this.details.manufacturer = this.device.manufacturer || window.navigator.appCodeName;
        this.details.screenResolution = this.platform.width() + 'x' + this.platform.height();
      });

      this.geolocation.getCurrentPosition().then((resp) => {
        let coords = resp.coords;
        ctrl.zone.runOutsideAngular(() => {
          ctrl.details.latitude = coords.latitude;
          ctrl.details.longitude = coords.longitude;
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      if (this.platform.is('cordova')) {
        var deviceName = cordova.plugins.deviceName;
        deviceName.get(function success(name) {
          console.log('deviceName: ', name);
          ctrl.zone.runOutsideAngular(() => {
            ctrl.details.name = name;
          });
        }, function failure(error) {
          console.log(error);
        });

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
      }else{
        ctrl.details.name = window.navigator.appName;
        ctrl.details.appName = window.navigator.appName;
        ctrl.details.versionNumber = '0.0.1';
        ctrl.details.storageSize = 935214440448;
        ctrl.details.ram = 8454688768;
        ctrl.details.macAddress = '65:a1:a6:18:94:0b';
      }
    });
  }

  syncApp() {
    console.log('This will save sync logs')
  }

}
