import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

@Component({
    selector: 'errorPage',
    templateUrl: 'unauthorized.template.html'
})

export class UnauthorizedComponent implements OnInit {
    @Input() msg: string;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef) {
    }

    ngOnInit(): any {
        this.route.data.subscribe(
            (data: any) => {
                let dd = data['unauthorized'];
                if (dd != null)
                    this.msg = "Usted no tiene acceso a esta página."
            }
        );

        if (this.msg == undefined || this.msg == null) {
            this.msg = "La página que busca no existe."
        }
    }
}
