import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'field-builder',
  templateUrl: 'field-builder.component.html'

})
export class FieldBuilderComponent implements OnInit {
  @Input() field:any;
  @Input() form:any;
  
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }

  get isTouched() { return this.form.controls[this.field.name].touched; }
  get isRequired() { return this.form.controls[this.field.name].errors.required; }
  get hasNotFormat() { return this.form.controls[this.field.name].errors.pattern; }
  get NoMatch() { return this.form.controls[this.field.name].errors.noMatch; }

  constructor() { }

  ngOnInit() {
  }

}
