/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:35-06:00
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
import { SentimentChartComponent } from './sentiment-chart/sentiment-chart.component'
import { PropertySuggestionComponent } from './property-suggestion/property-suggestion.component'
import { ChartsModule } from 'ng2-charts/ng2-charts'
import { FormsModule } from '@angular/forms'
import { ModalModule } from 'ng2-bootstrap'
import { ContextInfoComponent } from './context-info/context-info.component'
import { CurrentPropertyComponent } from './current-property/current-property.component'

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    SentimentChartComponent,
    PropertySuggestionComponent,
    CurrentPropertyComponent,
    ContextInfoComponent
  ],
  declarations: [
    SentimentChartComponent,
    PropertySuggestionComponent,
    ContextInfoComponent,
    CurrentPropertyComponent
  ]
})
export class ChatExtensionsModule { }
