import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessLayoutComponent } from './business-layout'; // 1. Update Import Name

describe('BusinessLayoutComponent', () => { // 2. Update Describe Name
  let component: BusinessLayoutComponent;   // 3. Update Variable Type
  let fixture: ComponentFixture<BusinessLayoutComponent>; // 4. Update Fixture Type

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessLayoutComponent] // 5. Update Import in Test Module
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessLayoutComponent); // 6. Create Component correctly
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});