import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
declare var google: any;

@Component({
    selector: 'office-map',
    template: `<div #map class="google_map" ></div>`
})
export class googleMaps {

    @ViewChild('map') mapElRef: ElementRef;
    _latLng: any = {};
    _clickMarker: any = true;
    _inPutSearchId: any = '';
    _viewMarker: any = true;
    _mapCircle: any = false;
    public map: any;
    public marker;
    public circle;


    @Input()
    public set viewMarker(val) {
        this._viewMarker = val;
        console.log(this._viewMarker);
    };

    @Input()
    public set clickMarker(val) {
        this._clickMarker = val;
        if (this._viewMarker == true && this.islatLngSet())
            this.placeMarker(val);
    };

    @Input()
    public set placeSearch(val) {
        this._inPutSearchId = val;
    };

    @Input()
    public set latLng(val) {
        this._latLng = val;
        if (this._viewMarker == true && this.islatLngSet())
            this.placeMarker(val);
    };

    @Input() set mapCircle(val) {
        this._mapCircle = val;
        if (this._mapCircle == true)
            this.placeCircle(this._latLng);
    };


    public get latLng() {
        return this._latLng;
    }

    @Output()
    public onSelect = new EventEmitter();

    ngAfterViewInit() {
        var el = this.mapElRef.nativeElement;
        var pos = { lat: -41.244027, lng: 174.62177 };
        this.map = new google.maps.Map(el, {
            zoom: this._latLng ? 15 : 1,
            center: this._latLng || pos,
            mapTypeId: 'roadmap'
        });

        if (this._mapCircle == true)
            this.placeCircle(pos);

        if (this._viewMarker == true && this._clickMarker) {
            this.map.addListener('click', (e) => {
                this.placeMarker(e.latLng);
                this.onSelect.emit(e.latLng);
            });
        }

        if (this._viewMarker == true && this.islatLngSet())
            this.placeMarker(this._latLng);

        if (this._viewMarker == true && this._inPutSearchId != '')
            this.initAutocomplete(this._inPutSearchId);
    }

    placeCircle(pos) {

        this.circle = new google.maps.Circle({
            strokeColor: '#2196f3',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#2196f3',
            fillOpacity: 0.35,
            map: this.map,
            center: this._latLng || pos,
            radius: 500
        });

    }


    placeMarker(latLng) {
        if (this.marker) {
            this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker({
            position: latLng,
            map: this.map
        });
    }
    islatLngSet() {
        if (this._latLng && Object.keys(this._latLng).length > 0) this.placeMarker(this._latLng);
    }


    initAutocomplete(inputID) {
        var $this = this;

        // Create the search box and link it to the UI element.
        var input = document.getElementById(inputID);

        if (!input)
            return;

        var searchBox = new google.maps.places.SearchBox(input);
        //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', function () {
            searchBox.setBounds($this.map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function (marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: $this.map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                $this.onSelect.emit(place.geometry.location);

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            $this.map.fitBounds(bounds);
        });
    }
}