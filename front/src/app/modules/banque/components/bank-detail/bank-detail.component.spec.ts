import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { BankDetailComponent } from './bank-detail.component';
import { By } from '@angular/platform-browser';
import { MatChipsModule, MatIconModule, MatButtonModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('BankDetailComponent', () => {
  let component: BankDetailComponent;
  let fixture: ComponentFixture<BankDetailComponent>;
  let spyDialogClose = jest.fn();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailComponent ],
      imports: [MatChipsModule, MatIconModule, MatButtonModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {close: spyDialogClose}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {tags: []}
        }
      ]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the with the name of the species', async(() => {
    component.owned = {_id: '', name_fr: 'Test', userPseudo: '', tags: []}
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const title = fixture.debugElement.query(By.css('#bank-detail-title'));
      expect(title.nativeElement.textContent).toEqual('Test');
    });
  }));

  it('should have a close button', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button#bank-detail-close'));
      expect(btn).toBeTruthy();
    });
  }));

  const sections = [
    {title: 'Nature(s)', identifier: 'nature', tagsTyped: true},
    {title: 'Talent(s)', identifier: 'ability', tagsTyped: true},
    {title: 'Attaque(s)', identifier: 'move', tagsTyped: true},
    {title: 'Autre(s)', identifier: 'other', tagsTyped: false}
  ];

  sections.forEach((section) => {

    describe('section '+section.title, () => {
      
      it('should have a setection '+section.title, async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const sectionNats = fixture.debugElement.query(By.css('#bank-detail-'+section.identifier));
          expect(sectionNats).toBeTruthy();
        });
      }));
      
      it('should have a title '+section.title, async(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          const sectionTitle = fixture.debugElement.query(By.css('#bank-detail-'+section.identifier+' .section-title'));
          expect(sectionTitle.nativeElement.textContent).toEqual(section.title);
        });
      }));

      if(section.tagsTyped) {
        it('should display all tags of type '+section.identifier+' in a chip list', async(() => {
          component.owned = {_id: '', name_fr: 'Test', userPseudo: '', tags: [
            {name_fr: 'Tag1', type: section.identifier},
            {name_fr: 'Tag2', type: section.identifier},
            {name_fr: 'Tag3', type: "not"+section.identifier}
          ]};
          component.ngOnInit();

          fixture.whenStable().then(() => {
            fixture.detectChanges();
            const sectionTitle = fixture.debugElement.queryAll(By.css('#bank-detail-'+section.identifier+' mat-chip-list mat-chip'));
            expect(sectionTitle.length).toEqual(2);
            expect(sectionTitle[0].nativeElement.textContent.trim()).toEqual('Tag1');
            expect(sectionTitle[1].nativeElement.textContent.trim()).toEqual('Tag2');
          });
        }));
      }
    });
  });
  
  describe('section Autre(s)', () => {
    
    it('should display all tags chip list exept typed nature, ability, move', async(() => {
      component.owned = {_id: '', name_fr: 'Test', userPseudo: '', tags: [
        {name_fr: 'Tag1', type: 'shiny'},
        {name_fr: 'Tag2', type: 'iv'},
        {name_fr: 'Tag3', type: 'nature'},
        {name_fr: 'Tag4', type: 'ability'},
        {name_fr: 'Tag5', type: 'move'},
      ]}
      component.ngOnInit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const sectionTitle = fixture.debugElement.queryAll(By.css('#bank-detail-other mat-chip-list mat-chip'));
        expect(sectionTitle.length).toEqual(2);
        expect(sectionTitle[0].nativeElement.textContent.trim()).toEqual('Tag1');
        expect(sectionTitle[1].nativeElement.textContent.trim()).toEqual('Tag2');
      });
    }));
  });
});
