import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGrupoComponent } from './dashboard-grupo.component';

describe('DashboardGrupoComponent', () => {
  let component: DashboardGrupoComponent;
  let fixture: ComponentFixture<DashboardGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
