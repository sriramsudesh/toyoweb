/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:19-06:00
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

@Component({
  selector: 'wcga-context-info',
  templateUrl: './context-info.component.html',
  styleUrls: ['./context-info.component.css']
})
export class ContextInfoComponent {
  private context: any
  public agent: string
  public phone: string
  public address: string
  public timeframe: string
  public contract: string
  public reasonForSale: string
  public contractExpiry: string
  public needReplacement: string
  public addressValidated: string
  public email: string

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.conversationContextUpdate) {
        this.context = event.data
        this.setValues()
      }
    })
  }

  setValues() {
    this.agent = this.context.agent
    this.phone = this.context.phone
    this.address = this.context.address
    this.timeframe = this.context.timeframe
    this.reasonForSale = this.context.reasonForSale
    this.contractExpiry = this.context.contractExpiry
    this.needReplacement = this.context.needReplacement
    this.addressValidated = this.context.addressValidated
    this.contract = this.context.contract
    this.contractExpiry = this.context.contractExpiry
    this.email = this.context.email
  }

}
