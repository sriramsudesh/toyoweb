/**
* @Date:   2017-02-03T18:03:46-06:00
* @Last modified time: 2017-03-03T00:55:50-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
// This represents the relevant information from Zillow APIs about a single property
//
export class PropertyDetails {

  public homeDetailsLink: string // Link to the Zillow Property Details
  public address: string
  public yearBuilt: string
  public finishedSqFt: string
  public bathrooms: string
  public bedrooms: string
  public lastSoldDate: string
  public estimate: string // Zestimate for the property

  constructor( details: any) {
    this.homeDetailsLink = details.homeDetailsLink
    this.address = details.address
    this.yearBuilt = details.yearBuilt
    this.finishedSqFt = details.finishedSqFt
    this.bathrooms = details.bathrooms
    this.bedrooms = details.bedrooms
    this.lastSoldDate = details.lastSoldDate
    this.estimate = details.estimate
  }
}
