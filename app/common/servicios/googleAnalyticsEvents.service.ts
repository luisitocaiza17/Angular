import { Injectable, Inject } from '@angular/core';

@Injectable()
export class GoogleAnalyticsEventsService {

    public emitEvent(eventCategory: string,
        eventAction: string,
        eventLabel: string = null,
        eventValue: number = null) {
        ga('send', 'event', {
            eventCategory: eventCategory,
            eventLabel: eventLabel,
            eventAction: eventAction,
            eventValue: eventValue
        });
    }

    public emitPageView(path: string) {        
        ga('send', 'pageview', path); //produccion
        //ga('send', 'pageview', '/CustomerSiteR2'+path); //solo pruebas
        //ga('config', 'GA_TRACKING_ID', {'page_path': '//CustomerSiteR2/'+path, page_title:'Detalle de ODA - Armonix'});        
    }


    
}