/* Magic Mirror
 * Module: MMM-Holiday
 *
 * By Cowboysdude
 * 
 */
Module.register("MMM-Holiday", {

    // Module config defaults.
    defaults: {
        fadeSpeed: 2200,
        updateInterval: 60 * 60 * 1000, // 60 minutes
        animationSpeed: 6000,
        initialLoadDelay: 5250,
        retryDelay: 2500,
        useHeader: false,
        header: "",
        MaxWidth: "50%",
        countryCode: "usa"
    },
    
    getStyles: function () {
		return ["MMM-Holiday.css"];
	},

    // Define required scripts. - The standard
    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.url = this.getHolidayUrl();
        this.today = "";
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Finding your Holidays...";
            wrapper.classList.add("dimmed", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
        
            for(var i = 0; i < this.holiday.length; i++){ 
			var holiday = this.holiday[i];

            var CurrentMonth = moment().format('MM');
            var NextMonth = moment().add(1, 'M').format('MM');
            var CurrentDay = moment().add(10, 'days').format("D");
            var CompareMonth = holiday.date.month;
            var allDate = holiday.date.month + "/" + holiday.date.day + "/" + holiday.date.year;
            var NewDate = moment(allDate).format("MM/DD/YYYY");
            
            
            var holidayColumn = document.createElement("div");

          
                var holidayDate = document.createElement("p");
                if (CompareMonth == CurrentMonth) {
                holidayDate.classList.add("xsmall", "bright", "now");
                holidayDate.innerHTML = allDate + " ~ " + holiday.localName;
               } 
                holidayColumn.appendChild(holidayDate);
                wrapper.appendChild(holidayColumn);
           
        }
        return wrapper;
    },

    processHoliday: function(data) {
        this.today = data.Today;
        this.holiday = data;
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getHoliday();
        }, this.config.updateInterval);
        this.getHoliday(this.config.initialLoadDelay);

    },

    getHolidayUrl: function() {
        var url = null;
        var holidayYear = moment().format('YYYY');
        var countryCode = this.config.countryCode.toLowerCase();
        url = "http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=" + holidayYear + "&country=" + countryCode + "&region=";
        return url;
    },

    getHoliday: function() {
        this.sendSocketNotification('GET_HOLIDAY', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOLIDAY_RESULT") {
            this.processHoliday(payload);
        this.updateDom(this.config.fadeSpeed);
        this.updateDom(this.config.initialLoadDelay);
       } 
    },

});
