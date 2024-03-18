const convert = require("xml-js");

const xml2json = (xml) => {
    const result = convert.xml2json(xml, {compact: true, spaces: 2});
    return JSON.parse(result);
}

module.exports = xml2json

// below is an example of filtering data from the json object

// var xml = `<?xml version="1.0"?>
// <feed xmlns="http://www.w3.org/2005/Atom" xmlns:espi="http://naesb.org/espi" xsi:schemaLocation="http://naesb.org/espi espiDerived.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <id>urn:uuid:55d49096-3fc9-4eeb-9f4e-74fcbbf50447</id>
//   <title>Green Button Data</title>
//   <updated>2023-06-03T08:00:43Z</updated>
//   <link rel="self" href="/espi/1_1/resource/Subscription/83e269c1" />
//   <entry>
//     <id>urn:uuid:f48c2080-e085-455a-af59-74733748d0d5</id>
//     <link rel="self" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F" />
//     <link rel="up" href="/espi/1_1/resource/RetailCustomer/9B6C7066" />
//     <link rel="related" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading" />
//     <link rel="related" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/UsageSummary" />
//     <link rel="related" href="/espi/1_1/resource/LocalTimeParameters/01" />
//     <title>Gas Consumption</title>
//     <content>
//       <UsagePoint xmlns="http://naesb.org/espi">
//         <ServiceCategory>
//           <kind>1</kind>
//         </ServiceCategory>
//       </UsagePoint>
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <title>2730 W SHANNON CT, CHANDLER, AZ 85224-3451</title>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
//   <entry>
//     <id>urn:uuid:21abc11a-b0ee-4958-8e25-c039ed966d63</id>
//     <link rel="self" href="/espi/1_1/resource/LocalTimeParameters/01" />
//     <link rel="up" href="/espi/1_1/resource/LocalTimeParameters" />
//     <title>Usage Summary</title>
//     <content>
//       <LocalTimeParameters xmlns="http://naesb.org/espi">
//         <dstEndRule>B40E2000</dstEndRule>
//         <dstOffset>3600</dstOffset>
//         <dstStartRule>B40E2000</dstStartRule>
//         <tzOffset>-18000</tzOffset>
//       </LocalTimeParameters>
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
//   <entry>
//     <id>urn:uuid:acddb952-00ec-4c72-97f5-483ad6eff139</id>
//     <link rel="self" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading/01" />
//     <link rel="up" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading" />
//     <link rel="related" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading/01/IntervalBlock" />
//     <link rel="related" href="/espi/1_1/resource/ReadingType/07" />
//     <title>Gas Consumption</title>
//     <content>
//       <MeterReading xmlns="http://naesb.org/espi" />
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
//   <entry>
//     <id>urn:uuid:64772a1a-bbfd-4c50-8297-90a03b6376c5</id>
//     <link rel="self" href="/espi/1_1/resource/ReadingType/07" />
//     <link rel="up" href="/espi/1_1/resource/ReadingType" />
//     <title>Type of Meter Reading Data</title>
//     <content>
//       <ReadingType xmlns="http://naesb.org/espi">
//         <accumulationBehaviour>4</accumulationBehaviour>
//         <commodity>7</commodity>
//         <currency>840</currency>
//         <dataQualifier>12</dataQualifier>
//         <flowDirection>1</flowDirection>
//         <intervalLength>900</intervalLength>
//         <kind>12</kind>
//         <phase>769</phase>
//         <powerOfTenMultiplier>5</powerOfTenMultiplier>
//         <timeAttribute>0</timeAttribute>
//         <uom>169</uom>
//       </ReadingType>
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
//   <entry>
//     <id>urn:uuid:67c068c6-cfc2-4444-b12c-a53de45c9306</id>
//     <link rel="self" href="&quot;/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading/01/IntervalBlock/8585157880416702829&quot;" />
//     <link rel="up" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/MeterReading/01/IntervalBlock" />
//     <title>Intervals</title>
//     <content>
//       <IntervalBlock xmlns="http://naesb.org/espi">
//         <interval xmlns="http://naesb.org/espi">
//           <duration>2592000</duration>
//           <start>1623193200</start>
//         </interval>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>527000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1623193200</start>
//           </timePeriod>
//           <value>400000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>532000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1625698800</start>
//           </timePeriod>
//           <value>400000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>538000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1628204400</start>
//           </timePeriod>
//           <value>400000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>681000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1630710000</start>
//           </timePeriod>
//           <value>500000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>687000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1633474800</start>
//           </timePeriod>
//           <value>500000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1116000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1635980400</start>
//           </timePeriod>
//           <value>800000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>10801000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1638831600</start>
//           </timePeriod>
//           <value>7700000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>9562000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1641596400</start>
//           </timePeriod>
//           <value>6800000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>4859000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1644274800</start>
//           </timePeriod>
//           <value>3400000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1918000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1646866800</start>
//           </timePeriod>
//           <value>1300000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1096000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1649458800</start>
//           </timePeriod>
//           <value>700000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1255000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1651878000</start>
//           </timePeriod>
//           <value>800000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>944000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1654642800</start>
//           </timePeriod>
//           <value>600000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>936000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1657234800</start>
//           </timePeriod>
//           <value>600000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>939000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1659740400</start>
//           </timePeriod>
//           <value>600000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>941000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1662505200</start>
//           </timePeriod>
//           <value>600000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1096000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1665010800</start>
//           </timePeriod>
//           <value>700000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>5866000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1667516400</start>
//           </timePeriod>
//           <value>3800000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>16669000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1670367600</start>
//           </timePeriod>
//           <value>10800000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>14529000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1673305200</start>
//           </timePeriod>
//           <value>9200000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>12506000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1675810800</start>
//           </timePeriod>
//           <value>7400000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>3606000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1678402800</start>
//           </timePeriod>
//           <value>2100000</value>
//         </IntervalReading>
//         <IntervalReading xmlns="http://naesb.org/espi">
//           <cost>1624000</cost>
//           <timePeriod>
//             <duration>2592000</duration>
//             <start>1680908400</start>
//           </timePeriod>
//           <value>900000</value>
//         </IntervalReading>
//       </IntervalBlock>
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
//   <entry>
//     <id>urn:uuid:a30be288-64af-4820-8b1a-14d1188ca295</id>
//     <link rel="self" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/UsageSummary" />
//     <link rel="up" href="/espi/1_1/resource/RetailCustomer/9B6C7066/UsagePoint/5446AF3F/UsageSummary" />
//     <title>Usage Summary</title>
//     <content>
//       <UsageSummary xmlns="http://naesb.org/espi">
//         <billingPeriod>
//           <duration>60480000</duration>
//           <start>1625266800</start>
//         </billingPeriod>
//         <billLastPeriod>93228000</billLastPeriod>
//         <billToDate>0</billToDate>
//         <costAdditionalLastPeriod>0</costAdditionalLastPeriod>
//         <currency>840</currency>
//         <overallConsumptionLastPeriod>
//           <powerOfTenMultiplier>5</powerOfTenMultiplier>
//           <timeStamp>1685818843</timeStamp>
//           <uom>169</uom>
//           <value>0</value>
//         </overallConsumptionLastPeriod>
//         <currentBillingPeriodOverAllConsumption>
//           <powerOfTenMultiplier>5</powerOfTenMultiplier>
//           <timeStamp>1685818843</timeStamp>
//           <uom>169</uom>
//           <value>0</value>
//         </currentBillingPeriodOverAllConsumption>
//         <qualityOfReading>14</qualityOfReading>
//         <statusTimeStamp>1685818843</statusTimeStamp>
//       </UsageSummary>
//     </content>
//     <published>2023-06-03T08:00:43Z</published>
//     <updated>2023-06-03T08:00:43Z</updated>
//   </entry>
// </feed>
// <?xml-stylesheet type='text/xsl' href='GreenButtonDataStyleSheet.xslt'?>`;


// const test = xml2json(xml).feed.entry;
// console.log(test);
// console.log(test.filter(item => {
//     return item.title._text === 'Usage Summary';
// }))