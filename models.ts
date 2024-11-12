// used for hours of operation in ui
const DayOfWeek = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SATURDAY: 'saturday',
    SUNDAY: 'sunday'
  };

const RestaurantStatus = {
  GREAT: 'DINE FEARLESSLY',
  GOOD: 'Dine Happily',
  MID: 'Dine Cautiously',
  BAD: 'Dine Shamefully'
};
  
// Not entire implementation: Simplified for use in Report class
class User {
  id: String
  name: String
  email: String
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class Report {
  id: String
  user: User
  datePosted: Date
  stars: number
  images: String[]
  heading: String
  description: String
  likes: number
  attributes: String[]
  inaccurate: number
  notHelpful: number
  emailReceived: String
  flag: String
  constructor({ id, user, datePosted, stars, images, heading, description, likes, 
      attributes, inaccurate, notHelpful, emailReceived, flag }) {
    this.id = id;
    this.user = user; 
    this.datePosted = new Date(datePosted);
    this.stars = stars;
    this.images = Array.isArray(images) ? images : [];
    this.heading = String(heading);
    this.description = String(description);
    this.likes = likes || 0;
    this.attributes = Array.isArray(attributes) ? attributes : [];
    this.inaccurate = inaccurate || 0;
    this.notHelpful = notHelpful || 0;
    this.emailReceived = String(emailReceived);
    this.flag = String(flag);
  }

  addImage(imageUUID) {
    if (typeof imageUUID !== 'string') {
      throw new Error('Image UUID must be a string');
    }
    this.images.push(imageUUID);
  }

  incrementLikes() {
    this.likes += 1;
  }

  markInaccurate() {
    this.inaccurate += 1;
  }

  markNotHelpful() {
    this.notHelpful += 1;
  }
}

class Restaurant {
  id: String
  name: String
  address: String
  images: String[]
  reports: Report[]
  hours: { [key: string]: string }
  oneLiner: String
  yelp: String
  instagram: String
  website: String
  resy: String
  maps: String
  dollarSigns: number
  phoneNumber: String
  goodAttributes: String[]
  badAttributes: String[]
  status: String
  nutrition: String
  constructor({ id, name, address, images, reports, hours, oneLiner, yelp, instagram, website, 
    resy, maps, dollarSigns, phoneNumber, goodAttributes, badAttributes, status, nutrition }) {
    this.id = id;
    this.name = String(name);
    this.address = String(address);
    this.images = Array.isArray(images) ? images : [];
    this.reports = Array.isArray(reports) ? reports.map(report => {
      return report instanceof Report ? report : new Report(report);
    }) : [];
    this.hours = this._validateAndFormatHours(hours);
    this.oneLiner = String(oneLiner);
    this.yelp = String(yelp);
    this.instagram = String(instagram);
    this.website = String(website);
    this.resy = String(resy);
    this.maps = String(maps);
    this.dollarSigns = this._validateDollarSigns(dollarSigns);
    this.phoneNumber = this._formatPhoneNumber(phoneNumber);
    this.goodAttributes = Array.isArray(goodAttributes) ? goodAttributes : [];
    this.badAttributes = Array.isArray(badAttributes) ? badAttributes : [];
    this.status = this._validateStatus(status);
    this.nutrition = String(nutrition);
  }

  _validateAndFormatHours(hours) {
    const formattedHours = {};
    for (const [day, times] of Object.entries(hours)) {
      if (!Object.values(DayOfWeek).includes(day.toLowerCase())) {
        throw new Error(`Invalid day: ${day}`);
      }
      if (times !== "Closed" && !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(String(times))) {
        throw new Error(`Invalid time format for ${day}: ${times}`);
      }
      formattedHours[day.toLowerCase()] = times;
    }
    return formattedHours;
  }

  _validateDollarSigns(dollarSigns) {
    const signs = dollarSigns;
    if (signs < 1 || signs > 4) {
      throw new Error('Dollar signs must be between 1 and 4');
    }
    return signs;
  }

  _validateStatus(status) {
    if (!Object.values(RestaurantStatus).includes(status.toLowerCase())) {
      throw new Error('Invalid status');
    }
    return status.toLowerCase();
  }

  _formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      throw new Error('Invalid phone number');
    }
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }

  addReport(report) {
    if (!(report instanceof Report)) {
      throw new Error('Invalid report object');
    }
    this.reports.push(report);
  }

  addImage(imageUUID) {
    if (typeof imageUUID !== 'string') {
      throw new Error('Image UUID must be a string');
    }
    this.images.push(imageUUID);
  }

  updateStatus(newStatus) {
    this.status = this._validateStatus(newStatus);
  }

  addGoodAttribute(attribute) {
    if (!this.goodAttributes.includes(attribute)) {
      this.goodAttributes.push(attribute);
    }
  }

  addBadAttribute(attribute) {
    if (!this.badAttributes.includes(attribute)) {
      this.badAttributes.push(attribute);
    }
  }

  getAverageRating() {
    if (!this.reports.length) return 0;
    const sum = this.reports.reduce((acc, report) => Number(acc) + Number(report.stars), 0);
    return (sum / this.reports.length).toFixed(1);
  }

  isOpenNow() {
    const now = new Date();
    const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const hours = this.hours[day];
    if (hours === "Closed") return false;
    
    const [open, close] = hours.split('-');
    return currentTime >= open && currentTime <= close;
  }
}

export { Restaurant, Report, User, DayOfWeek, RestaurantStatus };