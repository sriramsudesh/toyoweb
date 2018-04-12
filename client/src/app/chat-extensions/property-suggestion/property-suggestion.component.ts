/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:27-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, ViewChild } from '@angular/core'
import { ModalDirective } from 'ng2-bootstrap'

import { PropertyDetails } from '../../classes/property.property-details.class'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'

@Component({
  selector: 'wcga-property-suggestion',
  templateUrl: './property-suggestion.component.html',
  styleUrls: ['./property-suggestion.component.css']
})
export class PropertySuggestionComponent {
  @ViewChild(ModalDirective) private propertyDetailsModal: ModalDirective
  public propertyDetails: Array<PropertyDetails>
  public currentSuggestion: number = -1
  public currentProperty: PropertyDetails
  private context: any
  private token = sessionStorage.getItem('wsl-api-token')

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      //
      // Property Suggest Shown Events
      //
      if (event.type === AppCommService.typeEnum.propertySuggest) {
        if (event.subType === AppCommService.subTypeEnum.propertySuggest.show) {
          // Show the property suggestion window
          this.propertyDetails = event.data
          if (this.propertyDetails && this.propertyDetails.length > 0) {
            this.currentSuggestion = 0
            this.selectedPropertyChange()
            setTimeout(() => {
              this.propertyDetailsModal.show()
            }, 1000)

          }
        }
        if (event.subType === AppCommService.subTypeEnum.propertySuggest.noResults) {
          this.context.addressValidated = 'false'
          this.context.citystatezip = ''
          this.context.address = ''
          this._appComm.sendMessage('', this.context, true)
        }
      //
      //  Context Update
      //
      } else if (event.type === AppCommService.typeEnum.conversationContextUpdate) {
        this.context = event.data
      }
    })
  }

  selectedPropertyChange() {
    if (this.currentSuggestion >= 0) {
      this.currentProperty = this.propertyDetails[this.currentSuggestion]
    }
  }

  selectProperty() {
    this.propertyDetailsModal.hide()
    this._appComm.selectProperty(this.propertyDetails[this.currentSuggestion], this.context)
  }

  cancelSelect() {
    this.propertyDetailsModal.hide()
    this.context.addressValidated = 'false'
    this.context.citystatezip = ''
    this.context.address = ''
    this._appComm.cancelPropertySelect()
    this._appComm.sendMessage('', this.context, true)
  }

}
