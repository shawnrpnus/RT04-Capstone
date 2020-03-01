export default class UpdateMeasurementsRequest {
  shoulder;
  waist;
  chest;
  hip;
  height;

  constructor(shoulder, waist, chest, hip, height) {
    this.shoulder = shoulder;
    this.waist = waist;
    this.chest = chest;
    this.hip = hip;
    this.height = height;
  }
}
