/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:00-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



/* global $:false */
import { Component, OnInit } from '@angular/core'
import { ChatMessage } from '../../classes/chat.message.class'
import { AppCommService } from '../../app-comm.service'
import { scrollToBottomOfChat } from '../util/util'
import { ChatDispatcher } from '../../classes/chat.dispatcher.class'
import { AppCommEvent } from '../../classes/appcomm.event.class'

@Component({
  selector: 'wcga-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

export class ChatboxComponent implements OnInit {
  messages: Array<ChatMessage> = []
  context: any = {}
  dispatchQueue: Array<ChatMessage> = []
  awaitingIndicator: boolean = true
  canDispatch: boolean = false
  dispatcher = new ChatDispatcher()

  constructor(private _appComm: AppCommService) {
    // Subscription to AppComm Events
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      //
      // Conversation Message Sent Events
      //
      if (event.type === AppCommService.typeEnum.conversationSent) {
        if (event.subType === AppCommService.subTypeEnum.conversationSent.standard) {
          // Message sent, standard mechanism (not a silent message)
          this.messages.push(new ChatMessage(event.data as string, 'to', 'text', false, {}))
          scrollToBottomOfChat()
          this.dispatcher.showIndicatorStatus(true)
        }
        if (event.subType === AppCommService.subTypeEnum.conversationSent.external) {
          // Message sent, external mechanism (a silent message)
          this.dispatcher.showIndicatorStatus(true)
        }
      //
      // Conversation Message Received Events
      //
      } else if (event.type === AppCommService.typeEnum.conversationReceived) {
        // Response received from conversation services
        this.dispatcher.dataReadyStatus(true)
        try {
          let messageArray: Array<string> = event.data.message.output.text

          for (let message of messageArray) {
            if (message) {
              this.dispatcher.addToQueue(new ChatMessage(message, 'from', 'text', false, {}))
            }
          }
        } catch (e) {
          // Fallback and just show the preformatted response
          this.dispatcher.addToQueue(new ChatMessage(event.data.text, 'from', 'text', false, {}))
        }
        scrollToBottomOfChat()
      //
      // Conversation Context Updated Events
      //
    } else if (event.type === AppCommService.typeEnum.conversationContextUpdate) {
        this.context = event.data
      }
    }, error => console.log(error))
    //
    // Handle the cases returned by the dispatcher
    //
    this.dispatcher.dispatcher.subscribe(message => {
      if (message.type === 'showIndicator') {
        this.awaitingIndicator = true
      }
      if (message.type === 'hideIndicator') {
        this.awaitingIndicator = false
      }
      if (message.type === 'showMessage') {
        this.messages.push(message.data)
        scrollToBottomOfChat()
      }
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      // All conversations start with an empty external message
      this.postMessage('', true)
    }, 500)
  }

  // Send a message to the conversation service thru appComm
  postMessage(message: string, externalMessage = false): void {
    this._appComm.sendMessage(message, this.context, externalMessage)
  }

  // Watch the animations on the typing indicator. Used for the dispatcher in
  // order to ensure that animations are complete before dispatching the message
  // to the UI
  indicatorAnimationCompleteHandler(direction) {
    if (direction === 'out') {
      this.dispatcher.indicatorOutCompleteStatus(true)
    } else if (direction === 'in') {
      this.dispatcher.indicatorInCompleteStatus(true)
    }
  }

// THIS WILL BE REMOVED!!!!
//
//
//
// BELOW THIS POINT



/*


  // This is a way to add new messages of specicial types beyond text.
  // Each type is an enrichment
  showEnrichment(incomingResponse: any): void {
    if (incomingResponse.enrichmentName === 'PROPSUGGEST') {
      if (incomingResponse.enrichment === false) {
        this.context.citystatezip = ''
        this.context.address = ''
        this.context.addressValidated = 'false'
        this.postMessage('', true)
      } else {
        this.dispatcher.addToQueue(new ChatMessage('Please select your address', 'from', 'PROPSUGGEST', false, incomingResponse.enrichment[0]))
      }
    }
  }
*/
}
