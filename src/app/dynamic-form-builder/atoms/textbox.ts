import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldsFunctionalityService } from 'src/app/services/fields-functionality.service';

// text,email,tel,textarea,password, 
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">
        <input *ngIf="!field.multiline" autocomplete="off" [attr.type]="field.type" 
        class="form-control form-control-sm"  [id]="field.name" [name]="field.name" 
        [formControlName]="field.name" maxlength="100"
        (keyup)="this.fieldService.validateFieldRecapture(field, form)"
        oninput="this.value = this.value.toUpperCase()"
        (blur)="setInputType($event, form)"
        onfocus="this.type='text'"
        >
        <textarea *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" 
        [formControlName]="field.name" [id]="field.name"
        rows="9" class="form-control" [placeholder]="field.placeholder"></textarea>
      </div> 
    `
})
export class TextBoxComponent {
    @Input() field:any = {};
    @Input() form:FormGroup;
    get isValid() { return this.form.controls[this.field.name].valid; }
    get isDirty() { return this.form.controls[this.field.name].dirty; }
    
    constructor(public fieldService: FieldsFunctionalityService) {
    }

    setInputType(event:any, form){
      const entries = Object.keys(form.controls)
      console.log(entries);
      event.target.type = 'text';
      var contador = 0;
      for(var i = 0; i < entries.length; i++)
      {
        // console.log(entries[i]);
        // console.log(event.target.name);
        var result= entries[i].indexOf(event.target.name);
        console.log(result);
        if(result == 0){
          contador++;
        }
      }

      if(contador > 1){
        if(event.target.name.indexOf('recaptura') > 0){
          event.target.type = 'text';
        }
        else{
          event.target.type = 'password';
        }  
      }         
    }

}