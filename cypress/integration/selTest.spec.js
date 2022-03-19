describe('first test', () => {

    it.skip('sort and serach', ()=>{

        cy.visit('/');
        cy.get('[title="Close"]').click();
        cy.contains('li[class="dropdown"]', "Table").click();
        cy.contains('li', "Table Sort & Search").click();
        cy.get('select[name="example_length"]').select("50");
        cy.get('option[value=50]').should('be.visible');

        cy.contains('[class="sorting"]', "Age").click();
        cy.contains('[class="sorting_asc"]', "Age").click();
        cy.get('tr[role=row]').then((rows)=>{
            cy.wrap(rows[0]).within(()=>{
                cy.get('td[class="sorting_1"]').then((el)=>{
                    expect(parseInt(el.text)).to.be.gt(65);
                })
            })
        })
    })

    it('api test', ()=>{

        const url = "/api/users?page=2";
        let options = {
            method:'GET', failOnStatusCode: false, url: url,
                    }
        cy.request(options).then((res)=>{
            expect(res.status).to.eq(200);
            expect(res.body.data.length).to.eq(6);
            expect(res.body.total_pages).to.eq(2);
            cy.log(res);
        });
    })

    it('api test2', ()=>{
        const id = 2;
        let options = {
            method:'GET', failOnStatusCode: false, url: '',
                    }
        options.url = `/api/users/${id}`
        cy.request(options).then((res)=>{
            expect(res.status).to.eq(200);
            expect(res.body.data.email).to.eq("janet.weaver@reqres.in");
            expect(res.body.data.first_name).to.eq("Janet");
            expect(res.body.data.last_name).to.eq("Weaver");
        })
    })

    it('api test3', () =>{

        const body = {
            "name": "John",
            "job": "Tester"
        };
        
        let options = {
            method:'POST', failOnStatusCode: false, url: '/api/users',
                    body: body,}
        cy.request(options).then((res)=>{
            // expect(res.status).to.eq(200);
            // expect(res.body.data.first_name).to.eq("John");
            // expect(res.body.data.last_name).to.eq("Tester");
        })


        const url = "/api/users?page=2";
        options = {
            method:'GET', failOnStatusCode: false, url: url,
                    }
        cy.request(options).then((res)=>{
            expect(res.status).to.eq(200);
            expect(res.body.data.length).to.eq(7);
            cy.log(res);
        });
    })
})