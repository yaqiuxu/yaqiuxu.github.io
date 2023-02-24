
var returned_location = "";
var events_data = null;
var selected_venue = null;

function hideLocationInput(){
    // When the auto-detect location checkbox is selected, the custom location input box must disappear
    // and when it is unchecked, the custom location input box is a required field, and a location string must be entered.
    var checkbox = document.getElementById("auto_location");
    var text = document.getElementById("input_location");
    if (checkbox.checked == true){
        text.style.display = "none";
    } else {
        text.style.display = "block";
    }
}

function autoDetectLocation(){
    myToken = "d95740ebbf0185";
    $.ajax({
        url: "https://ipinfo.io/",
        type:  "GET",
        async: false,
        data:{
            token: myToken
        },
        dataType: "json",
        success: function (data){
            returned_location = data.loc;
        },
        error: function (ex) {
            alert(ex.responseText);
        }
    })
}

function searchEvents(){
    if (document.getElementById("keyword").reportValidity() == false){
        return;
    }
    var keyword = document.getElementById("keyword").value.split(" ").join("+");
    var distance = document.getElementById("distance").value;
    var category = document.getElementById("category").value;
    var auto_location = document.getElementById("auto_location").checked;
    var event_location = "";

    if (distance == ""){
        distance = 10;
    }
    if (auto_location){
        autoDetectLocation();
        event_location = returned_location;
    } else {
        var input_location = document.getElementById("input_location");
        input_location.required = true;
        if (input_location.reportValidity() == false){
            return;
        }
        event_location = input_location.value.split(" ").join("+");
    }

    // send to backend
    $.ajax({
        // url: "http://127.0.0.1:5000/searchEvents",
        url: "/searchEvents",
        type: "GET",
        data: {
            keyword: keyword,
            distance: distance,
            category: category,
            auto_location : auto_location,
            location: event_location
        },
        dataType: "json",
        success: function(data){
            events_data = data;
            showResults(data);
        },
        error: function (ex) {
            alert(ex.responseText);
        }
    })
    
}

function clearForm(){
    console.log("clear")
    location.href = "#search_box";
    document.getElementById("keyword").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("distance").placeholder = 10;
    document.getElementById("category").value = "default";
    document.getElementById("auto_location").checked = false;
    document.getElementById("input_location").style.display = "block";
    document.getElementById("input_location").value = "";

    clearResults();
}

function clearResults(){
    document.getElementById("search_results").style.display = "none";
    document.getElementById("no_recoreds_found").style.display = "none";
    document.getElementById("event_details").style.display = "none";
    document.getElementById("venue_details").style.display = "none";
}

function showResults(data){
    console.log(data);
    console.log("size: " + data.events.length);

    clearResults();
    document.getElementById("search_results").innerHTML = "";

    if (data.events.length > 0){
        document.getElementById("search_results").style.display = "block";
        // draw the table
        let table = document.createElement('table');
        table.id = "result_table";
        document.getElementById('search_results').appendChild(table);
        let thead = document.createElement('thead');
        table.appendChild(thead);
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        // draw the heading
        let heading = document.createElement('tr');
        heading.className = "result_heading";
        
        let th1 = document.createElement('th');
        th1.className = "date_detail";
        th1.innerHTML = "Date";
        heading.appendChild(th1);

        let th2 = document.createElement('th');
        th2.className = "icon_detail";
        th2.innerHTML = "Icon";
        heading.appendChild(th2);

        let th3 = document.createElement('th');
        th3.className = "event_detail";
        th3.innerHTML = "Event";
        th3.setAttribute("onclick", "sortEvents(2)");
        heading.appendChild(th3);

        let th4 = document.createElement('th');
        th4.className = "genre_detail";
        th4.innerHTML = "Genre";
        th4.setAttribute("onclick", "sortEvents(3)");
        heading.appendChild(th4);

        let th5 = document.createElement('th');
        th5.className = "venue_detail";
        th5.innerHTML = "Venue";
        th5.setAttribute("onclick", "sortEvents(4)");
        heading.appendChild(th5);

        thead.appendChild(heading);
        // add rows
        for (let i = 0; i < data.events.length; i ++){
            let event = data.events[i];
            let date =  replace_null(event.dates?.start?.localDate, "");
            date += null_set.has(event.dates?.start?.localTime, "")? "": "<br>" + event.dates?.start?.localTime;
            let event_title = event.name;
            let genre = event.classifications?.[0]?.segment?.name;
            let venue = event._embedded?.venues?.[0]?.name;

            let row = document.createElement('tr');
            let date_td = document.createElement('td');
            date_td.innerHTML = date;
            row.appendChild(date_td);

            let icon = document.createElement('td');
            let img = document.createElement("img");
            img.className = "icon_img";
            img.src = event.images[0].url;
            img.height = "100";
            img.width = "100";
            icon.appendChild(img);
            row.appendChild(icon);

            let event_td = document.createElement('td');
            event_td.innerHTML = "<a class='event_td'>" + event_title + "</a>";
            // event_td.setAttribute("onclick", "displayDetail(" + i + ")");
            event_td.setAttribute("onclick", "displayReturnedDetail(" + i + ")");
            row.appendChild(event_td);
            
            let genre_td = document.createElement('td');
            genre_td.innerHTML = genre;
            row.appendChild(genre_td);

            let venue_td = document.createElement('td');
            venue_td.innerHTML = venue;
            row.appendChild(venue_td);
            
            tbody.appendChild(row);
        }
        // location.href = "#search_results";
    } else if (data.geocode == false) {
        document.getElementById("no_recoreds_found").style.display = "block";
        document.getElementById("no_record_message").innerHTML = "Can not Geocode the Location";
    }
     else {
        document.getElementById("no_recoreds_found").style.display = "block";
        document.getElementById("no_record_message").innerHTML = "No Records Found";
    }
}

var asc = Array(5).fill(true);
// reference https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortEvents(col){
    console.log("sort column: " + col)
    // console.log(asc);

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("result_table");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i ++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[col];
            y = rows[i + 1].getElementsByTagName("TD")[col];
            // Check if the two rows should switch place:
            if (asc[col]){
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    asc[col] = !asc[col];  // change to descend
}

function displayDetail(i){
    let id = events_data.events[i].id;
    $.ajax({
        // url: "http://127.0.0.1:5000/eventDetail",
        url: "/eventDetail",
        type: "GET",
        data:{
            id: id,
        },
        dataType: "json",
        success: function(data){
            console.log(data);
            displayReturnedDetail(data);
        },
        error: function (ex) {
            alert(ex.responseText);
        }
    })
}

var null_set = new Set([null, undefined, "Undefined", ""]);
function replace_null(value, null_string){
    if (null_set.has(value)){
        return null_string;
    }
    return value;
}

function displayReturnedDetail(i){
    // let event = data.events[0];  // for displayDetail(i), change displayReturnedDetail(i) to displayReturnedDetail(data)
    let event = events_data.events[i];

    // reference https://codingbeautydev.com/blog/javascript-cannot-read-property-of-undefined/#:~:text=The%20%E2%80%9Ccannot%20read%20property%20of%20undefined%E2%80%9D%20error%20occurs%20when%20you,the%20variable%20before%20accessing%20it.
    let event_title = event.name;
    let date = replace_null(event.dates?.start?.localDate, "") + " " + replace_null(event.dates?.start?.localTime, "");    
    let venue = event._embedded.venues?.[0]?.name;
    let genres = null_set.has(event.classifications?.[0]?.segment?.name)? "": event.classifications?.[0]?.segment?.name;
    genres += null_set.has(event.classifications?.[0]?.genre?.name)? "": " | " + event.classifications?.[0]?.genre?.name;
    genres += null_set.has(event.classifications?.[0]?.subGenre?.name)? "": " | " + event.classifications?.[0]?.subGenre?.name;
    genres += null_set.has(event.classifications?.[0]?.type?.name)? "": " | " + event.classifications?.[0]?.type?.name;
    genres += null_set.has(event.classifications?.[0]?.subType?.name)? "": " | " + event.classifications?.[0]?.subType?.name;
    let priceRanges = null_set.has(event.priceRanges?.[0]?.min)? "": event.priceRanges?.[0]?.min;
    priceRanges +=  null_set.has(event.priceRanges?.[0]?.max)? "": " - " + event.priceRanges?.[0]?.max;
    priceRanges += null_set.has(event.priceRanges?.[0]?.currency)? "": " " + event.priceRanges?.[0]?.currency;
    let ticketStatus = event.dates?.status?.code;
    let buyTicketAt = event.url;
    let seatMap = event.seatmap?.staticUrl;
    // console.log(null_set.has(event.priceRanges?.[0]?.max));
    console.log([event_title, date, venue, genres, priceRanges, ticketStatus, buyTicketAt, seatMap].join(" "));

    let event_title_div = document.getElementById("eventTitle");
    let date_div = document.getElementById("date");
    let artist_div = document.getElementById("artistTeam");
    let venue_div = document.getElementById("venue");
    let genres_div = document.getElementById("genres");
    let priceRanges_div = document.getElementById("priceRanges");
    let ticketStatus_div = document.getElementById("ticketStatus");
    let BuyTicketAt_div = document.getElementById("BuyTicketAt");
    let seatMap_div = document.getElementById("seatMap");
    // set title
    event_title_div.innerHTML = event_title;
    // set date
    if (null_set.has(date)){
        date_div.style.display = "none";
    } else {
        document.getElementById("date").innerHTML = "<p class='detail_titles'>Date</p>" + "<p class='event_detail_text'>" + date + "</p>";
    }
    // set artist/team
    if (null_set.has(event._embedded?.attractions)) {
        artist_div.style.display = "none";
    } else {
        let inner = "<p class='detail_titles'>Artist/Team</p>";
        for (let i = 0; i < event._embedded.attractions.length; i ++) {
            let artist = event._embedded.attractions?.[i]?.name;
            let artist_url = event._embedded.attractions?.[i]?.url;
            if (null_set.has(artist) || null_set.has(artist_url)){
                continue;
            } else {
                if (i == 0) {
                    inner += "<a href='" + artist_url + "' target='_blank'>" + artist + "</a>";
                } else {
                    inner += " | " + "<a href='" + artist_url + "' target='_blank'>" + artist + "</a>";
                }
            }
        }
        console.log(inner);
        artist_div.style.display = "block";
        document.getElementById("artistTeam").innerHTML =  inner; 
    }
    
    // set venue
    if (null_set.has(venue)){
        venue_div.style.display = "none";
    } else {
        selected_venue = venue;
        document.getElementById("venue").innerHTML = "<p class='detail_titles'>Venue</p>" + "<p class='event_detail_text'>"  + venue + "</p>";
    }
    // set genres
    if (null_set.has(genres)){
        genres_div.style.display = "none";
    } else {
        document.getElementById("genres").innerHTML = "<p class='detail_titles'>Genres</p>" + "<p class='event_detail_text'>"  + genres + "</p>";
    }
    // set price ranges
    if (null_set.has(priceRanges)){
        priceRanges_div.style.display = "none";
    } else {
        document.getElementById("priceRanges").innerHTML = "<p class='detail_titles'>Price Ranges</p>" + "<p class='event_detail_text'>" + priceRanges + "</p>";
    }
    // set ticket status
    if (null_set.has(ticketStatus)){
        ticketStatus_div.style.display = "none";
    } else {
        const collection = document.getElementsByClassName("ticket_status_div");
        for(let i = 0; i < collection.length; i ++) {  // hide all the status bars
            collection[i].style.display = "none";
        }
        switch (ticketStatus) {
            case "onsale":
                document.getElementById("onsale").style.display = "block";
                break;
            case "offsale":               
                document.getElementById("offsale").style.display = "block";
                break;
            case "cancelled":
                document.getElementById("canceled").style.display = "block";
                break;
            case "postponed":
                document.getElementById("postponed").style.display = "block";
                break;
            case "rescheduled":
                document.getElementById("rescheduled").style.display = "block";
                break;
            default:
                console.log("undefined ticket status: " + ticketStatus);
                break;
        }
    }
    // buy ticket at
    if (null_set.has(buyTicketAt)){
        BuyTicketAt_div.style.display = "none";
    } else {
        document.getElementById("BuyTicketAt").innerHTML = "<p class='detail_titles'>Buy Ticket At</p>" + "<a target='_blank' href='" + buyTicketAt + "'>Ticketmaster</a>";
    }
    // set seat map
    if (null_set.has(seatMap)){
        seatMap_div.style.display = "none";
    } else {
        document.getElementById("seatMap").innerHTML = "<img alt='seat_map' src='" + seatMap + "'>";
    }
    
    document.getElementById("event_details").style.display = "block";
    document.getElementById("show_venue_details").style.display = "block";
    document.getElementById("venue_details").style.display = "none";
    location.href = "#event_detail_box";
}

function showVenue(){
    $.ajax({
        // url: "http://127.0.0.1:5000/searchVenue",
        url: "/searchVenue",
        type: "GET",
        data:{
            keyword: selected_venue.split(" ").join("+"),
        },
        dataType: "json",
        success: function(data){
            console.log(data);

            let venue = data.venues[0];
            let venue_name = venue.name;
            let venue_logo = venue.images?.[0]?.url;
            let address = replace_null(venue.address?.line1, "N/A");
            let city = [replace_null(venue.city?.name, "N/A"), replace_null(venue.state?.stateCode, "N/A")].join(', ');
            let postal = venue.postalCode;
            let upcomingEvents = replace_null(venue.url, "N/A");
            // redirect users to location on Google Maps: <Name of venue>, <street address>, <city>, <state>, <zip code>
            let query_text = [venue_name, address, city, postal].join(',').split(' ').join('+');
            let google_map_search = "https://www.google.com/maps/search/?api=1&query=" + query_text;
            console.log([venue_name, address, city, postal, google_map_search, upcomingEvents].join(' '));

            let venue_name_div = document.getElementById("venue_name");
            let venue_logo_div = document.getElementById("venue_logo");
            let address_div = document.getElementById("address");
            let google_map_search_div = document.getElementById("googleMapURL");
            let upcomingEvents_div = document.getElementById("upcomingEvents");

            venue_name_div.innerHTML = "  " + venue_name + "  ";
            if (null_set.has(venue_logo) == false) {
                venue_logo_div.innerHTML = "<img alt='venue_logo' src='" + venue_logo + "'>";
            }
            address_div.innerHTML = address + "<br>" + city + "<br>" + postal;
            google_map_search_div.innerHTML = "<a target='_blank' href='" + google_map_search + "'>Open in Google Maps</a>";
            if (upcomingEvents != "N/A"){
                upcomingEvents_div.innerHTML = "<a target='_blank' href='" + upcomingEvents + "'>More events at this venue</a>";
            } else {
                upcomingEvents_div.innerHTML = "N/A";
            }

            document.getElementById("show_venue_details").style.display = "none";
            document.getElementById("venue_details").style.display = "block";
            location.href = "#venue_details";
        },
        error: function (ex) {
            alert(ex.responseText);
        }
    })
}
    
