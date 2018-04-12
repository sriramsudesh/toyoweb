import { Injectable, EventEmitter } from '@angular/core'
import { AppCommEvent } from './classes/appcomm.event.class'
import { PropertyDetails } from './classes/property.property-details.class'
import { OrchestratedConversationService } from './orchestrated-conversation.service'
import { NLUService } from './nlu.service'

@Injectable()
export class AppCommService {
  public static typeEnum = {
    conversationSent: 'CONVSENT',
    conversationReceived: 'CONVRECEIVED',
    conversationContextUpdate: 'CONVCONTEXTUPDATE',
    propertySuggest: 'PROPERTYSUGGEST',
    nlu: 'NLU',
    showDetailsPopup: 'SHOWDETAILS'
  }
  public static subTypeEnum = {
    conversationSent: {
      standard: 'STANDARD',
      external: 'EXTERNAL'
    },
    propertySuggest: {
      show: 'SHOW',
      selected: 'SELECTED',
      noResults: 'NORESULTS',
      canceled: 'CANCELED'
    },
    nlu: {
      sentiment: 'SENTIMENT',
      emotion: 'EMOTION'
    }
  }
  public appComm$ = new EventEmitter<AppCommEvent>()
  constructor(private _conversation: OrchestratedConversationService, private _nlu: NLUService) { }

  // Send a message and show the outgoing message in the chat window.
  public sendMessage(message: string, context: any, external = false) {
    // Conversation sent event
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationSent, external ? AppCommService.subTypeEnum.conversationSent.external : AppCommService.subTypeEnum.conversationSent.standard, message))
    if (!external) {
      this.getSentiment(message)
      this.getEmotion(message)
    }
    this._conversation.sendMessage(message, context).subscribe(response => {
      // Conversation received event
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationReceived, '', response))
      // Conversation context updated event
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationContextUpdate, '', response.message.context))

      // Handle enrichment requests
      if (response.enrichmentName === 'PROPSUGGEST') {
        // Show property suggest extension event
        if (response.enrichment !== false) {
          this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.propertySuggest, AppCommService.subTypeEnum.propertySuggest.show, response.enrichment[0]))
        } else {
          // No results for the property
          this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.propertySuggest, AppCommService.subTypeEnum.propertySuggest.noResults, {}))
        }
      }
    })
  }

  public getSentiment(text: string) {
    this._nlu.getSentiment(text).subscribe(response => {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.nlu, AppCommService.subTypeEnum.nlu.sentiment, response))
    })
  }

  public getEmotion(text: string) {
    this._nlu.getEmotion(text).subscribe(response => {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.nlu, AppCommService.subTypeEnum.nlu.emotion, response))
    })
  }

  public selectProperty(property: PropertyDetails, context: any) {
    context.addressValidated = 'true'
    this.sendMessage(property.address, context, true)
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.propertySuggest, AppCommService.subTypeEnum.propertySuggest.selected, property))
  }

  public showDetailsPopup() {
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.showDetailsPopup, '', {}))
  }

  public cancelPropertySelect() {
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.propertySuggest, AppCommService.subTypeEnum.propertySuggest.canceled, {}))
  }

}
