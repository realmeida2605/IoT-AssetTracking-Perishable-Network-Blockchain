/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A business network for shipping perishable goods
 * The cargo is temperature controlled and contracts
 * can be negociated based on the temperature
 * readings received for the cargo
 */

namespace org.acme.shipping.perishable

/**
 * The type of perishable product being shipped
 */
enum ProductType {
  o BANANAS
  o APPLES
  o PEARS
  o PEACHES
  o COFFEE
  o MEDICINE
}

/**
 * Directions of the compass
 */
enum CompassDirection {
  o N
  o S
  o E
  o W
}

/**
 * An Accelerometer reading for a shipment. E.g. received from a
 * device within an accelerometer controlled shipping container
 *
 * The combination of the accelerometer environment reading,
 * PLUS the GPS location, PLUS the timestamp is what is interesting
 * Just knowing temperature without knowing where or when is
 * not sufficient.
 */
transaction AccelReading extends ShipmentTransaction {
  o Double accel_x
  o Double accel_y
  o Double accel_z
  o String latitude
  o String longitude
  o String readingTime
}


/**
 * For transaction TemperatureReading extends ShipmentTransaction, modify the 
 * transaction so that it uses the following variables. In this case, replace  
 * centigrade with celsius and add the three other strings.
 */
transaction TemperatureReading extends ShipmentTransaction {
  o Double celsius
  o String latitude
  o String longitude
  o String readingTime
}

/**
 * A GPS reading for a shipment. E.g. received from a device
 * within a shipping container
 */
transaction GpsReading extends ShipmentTransaction {
  o String readingTime
  o String readingDate
  o String latitude
  o CompassDirection latitudeDir
  o String longitude
  o CompassDirection longitudeDir
}

/**
 * For the IoT data to be associated with the asset and shipment, add IoT variables to 
 * the asset model for shipment. Enter the following additions to asset Shipment 
 * identified by shipmentId.
 */
asset Shipment identified by shipmentId {
  o String shipmentId
  o ProductType type
  o ShipmentStatus status
  o Long unitCount
  --> Contract contract
  o TemperatureReading[] temperatureReadings optional
  o AccelReading[] AccelReadings optional
  o GpsReading[] gpsReadings optional
}

/**
 * Add Double maxAccel to the Contract asset model.
 */
asset Contract identified by contractId {
  o String contractId
  --> Grower grower
  --> Shipper shipper
  --> Importer importer
  o DateTime arrivalDateTime
  o Double unitPrice
  o Double minTemperature
  o Double maxTemperature
  o Double minPenaltyFactor
  o Double maxPenaltyFactor
  o Double maxAccel
}

/**
 * An event - when the temperature goes outside the agreed-upon boundaries
 */
event TemperatureThresholdEvent {
  o String message
  o Double temperature
  o String latitude
  o String longitude
  o String readingTime
  --> Shipment shipment
}

/**
 * An event - when the acceleration event has been detected
 */
event AccelerationThresholdEvent {
  o String message
  o Double accel_x
  o Double accel_y
  o Double accel_z
  o String latitude
  o String longitude
  o String readingTime
  --> Shipment shipment
}

/**
 * An event - when the ship arrives at the port
 */
event ShipmentInPortEvent {
  o String message
  --> Shipment shipment
}

/**
 * The status of a shipment
 */
enum ShipmentStatus {
  o CREATED
  o IN_TRANSIT
  o ARRIVED
}

/**
 * An abstract transaction that is related to a Shipment
 */
abstract transaction ShipmentTransaction {
  --> Shipment shipment
}

/**
 * A notification that a shipment has been received by the
 * importer and that funds should be transferred from the importer
 * to the grower to pay for the shipment.
 */
transaction ShipmentReceived extends ShipmentTransaction {
}

/**
 * A concept for a simple street address
 */
concept Address {
  o String city optional
  o String country
  o String street optional
  o String zip optional
}

/**
 * An abstract participant type in this business network
 */
abstract participant Business identified by email {
  o String email
  o Address address
  o Double accountBalance
}

/**
 * A Grower is a type of participant in the network
 */
participant Grower extends Business {
}

/**
 * A Shipper is a type of participant in the network
 */
participant Shipper extends Business {
}

/**
 * An Importer is a type of participant in the network
 */
participant Importer extends Business {
}

/**
 * JUST FOR INITIALIZING A DEMO
 */
transaction SetupDemo {
}
