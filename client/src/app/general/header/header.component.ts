/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:59-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, OnInit } from '@angular/core'
import { AppCommService } from '../../app-comm.service'
import { LoopbackLoginService} from '../../auth/loopback/lb-login.service'

@Component({
  selector: 'wcga-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _appComm: AppCommService, private _lbLogin: LoopbackLoginService) { }

  ngOnInit() {
  }

  showWatsonDetails() {
    this._appComm.showDetailsPopup()
  }

  logout() {
    this._lbLogin.logout().subscribe()
  }

}
