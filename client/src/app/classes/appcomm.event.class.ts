/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:41-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
// This represents a standard 'AppComm' event used for inter-app communication
//
export class AppCommEvent {
  public type: string // Type of the event (ex: Messages)
  public subType: string // Subtype of the event (ex: Added, Removed)
  public data: any // Payload of event
  constructor(type: string, subType: string, data: any ) {
    this.type = type
    this.subType = subType
    this.data = data
  }
}
