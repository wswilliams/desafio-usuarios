import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BreadCrumpComponent} from './bread-crump/bread-crump.component';
import {PageHeaderComponent} from './page-header/page-header.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {FormFieldErrorComponent} from './form-field-error/form-field-error.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    BreadCrumpComponent,
    PageHeaderComponent,
    FormFieldErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BreadCrumpComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    NgxMaskModule
  ]
})
export class SharedModule {
}
