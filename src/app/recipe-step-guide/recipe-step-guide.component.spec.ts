import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStepGuideComponent } from './recipe-step-guide.component';

describe('RecipeStepGuideComponent', () => {
  let component: RecipeStepGuideComponent;
  let fixture: ComponentFixture<RecipeStepGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeStepGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeStepGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
