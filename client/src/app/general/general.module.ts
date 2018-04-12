/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:56:20-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChatModule } from '../chat/chat.module'
import { ChatExtensionsModule } from '../chat-extensions/chat-extensions.module'


import { HeaderComponent } from './header/header.component'
import { ModalModule } from 'ng2-bootstrap'
import { HomeComponent } from './home/home.component'
import { SidebarComponent } from './sidebar/sidebar.component'

@NgModule({
  imports: [
    CommonModule,
    ChatModule,
    ModalModule,
    ChatExtensionsModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    HomeComponent
  ]
})
export class GeneralModule { }
