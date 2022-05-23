import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-add-acknowledgement',
  templateUrl: './add-acknowledgement.component.html',
  styleUrls: ['./add-acknowledgement.component.css']
})
export class AddAcknowledgementComponent implements OnInit {
  @Input() draftId;
  resDraftData: any;
  isAddStep = false;
  resDraftForm: FormGroup;
  step;
  constructor(public dialogRef: MatDialogRef<AddAcknowledgementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService,
    private loaderService: LoaderService) {
    this.resDraftForm = this.fb.group({
      condition: '',
      conditionAlphabet: '',
      conditionId: 0,
      draftId: 0,
      reason: '',
      stepId: 0,
      stepNo: 0,
      step: {}
    });
  }

  ngOnInit(): void {
    if (this.data.value !== null) {
      this.step = this.data.resDraftSteps.filter(x => x.stepId === this.data.value.stepId)[0];
      this.resDraftForm.patchValue({
        condition: this.data.value.condition,
        conditionAlphabet: this.data.value.conditionAlphabet,
        conditionId: this.data.value.conditionId,
        draftId: this.data.value.draftId,
        reason: this.data.value.reason,
        stepId: this.data.value.stepId,
        stepNo: this.data.value.stepNo,
        step: this.step
      });
    }

  }

  submit() {
    if (this.resDraftForm.invalid) {
      this.resDraftForm.get('step').markAsTouched();
      this.resDraftForm.get('conditionAlphabet').markAsTouched();
      this.resDraftForm.get('condition').markAsTouched();
      this.loaderService.display(false);
    } else {
      this.resDraftForm.removeControl('step');
      const obj = this.resDraftForm.value;
      obj.draftId = this.step.draftId;
      obj.stepId = this.step.stepId;
      obj.stepNo = this.step.stepNo;
      obj.reason = this.step.requestReason;
      this.loaderService.display(true);
      this.restService.saveResCond(obj).subscribe(() => {
        this.loaderService.display(false);
        this.dialogRef.close();
      }, () => {
        this.loaderService.display(false);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
