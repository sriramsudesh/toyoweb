/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:54:54-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core'
import { AppCommService } from '../../../app-comm.service'
import { AppCommEvent } from '../../../classes/appcomm.event.class'


@Component({
  selector: 'wcga-chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements AfterViewInit {
  public text: string = ''
  @Output() sendMessage = new EventEmitter<string>()
  @ViewChild('chatInput') private inputElement: ElementRef
  constructor(private _appComm: AppCommService, private renderer: Renderer) {
    // Subscription to AppComm Events
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.propertySuggest) {
        if (event.subType === AppCommService.subTypeEnum.propertySuggest.canceled || event.subType === AppCommService.subTypeEnum.propertySuggest.selected ) {
          this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'removeAttribute', ['disabled'])
          this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
        } else if (event.subType === AppCommService.subTypeEnum.propertySuggest.show ) {
          this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'blur')
          this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'setAttribute', ['disabled', true])
        }
      }
    })
  }

  emitKeyPress(e) {
    if (e.code === 'Enter' || e.code === 'enter') {
      this.emitSendMessage()
    }
  }

  emitSendMessage() {
    if (this.text) {
      this.sendMessage.emit(this.text)
    }
    this.text = ''
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
  }
}
