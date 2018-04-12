/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:23-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'
import { PropertyDetails } from '../../classes/property.property-details.class'

@Component({
  selector: 'wcga-current-property',
  templateUrl: './current-property.component.html',
  styleUrls: ['./current-property.component.css']
})
export class CurrentPropertyComponent {
  public currentProperty: PropertyDetails
  private token = sessionStorage.getItem('wsl-api-token')

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      //
      // Property Suggest Selected Event
      //
      if (event.type === AppCommService.typeEnum.propertySuggest) {
        if (event.subType === AppCommService.subTypeEnum.propertySuggest.selected) {
          this.currentProperty = event.data
        }
      }
    })
   }
}
