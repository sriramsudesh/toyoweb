/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:56:14-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, ViewChild } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'
import { ModalDirective } from 'ng2-bootstrap'

@Component({
  selector: 'wcga-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private propertySelected = false
  @ViewChild(ModalDirective) private detailsMobile: ModalDirective // Popup for mobile devices

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.propertySuggest && event.subType === AppCommService.subTypeEnum.propertySuggest.selected) {
        this.propertySelected = true
      } else if (event.type === AppCommService.typeEnum.showDetailsPopup) {
        this.detailsMobile.show()
      }
    })
  }


}
