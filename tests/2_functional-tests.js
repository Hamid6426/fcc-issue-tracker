const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require('../models/Issue');
const { nanoid } = require('nanoid');
const { expect } = require('chai');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    const project = 'testing';

    const issue = {

        issue_title: `Test Issue ${nanoid(10)}`,
        issue_text: 'This is a test issue',
        created_by: 'Robot',
        assigned_to: 'Stevan',
        status_text: 'development'

    };

    const openFilter = { open: true };
    const statusFilter = { status_text: 'development' };

    const updateIssueText = 'issue text has been updated.';
    const updateAssignedTo = 'Steve';

    const invalidId = '6275d73f52abd03df630186e';

    test('POST /api/issues/{project} create an issue with every field', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .send(`assigned_to=${ issue.assigned_to }`)
        .send(`status_text=${ issue.status_text }`)
        .end((err, res) => {

            if (err) console.log(err);
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'issue_title', issue.issue_title);
            assert.propertyVal(res.body, 'issue_text', issue.issue_text);
            assert.propertyVal(res.body, 'created_by', issue.created_by);
            assert.propertyVal(res.body, 'assigned_to', issue.assigned_to);
            assert.propertyVal(res.body, 'status_text', issue.status_text);
            assert.propertyVal(res.body, 'open', true);
            assert.property(res.body, 'projectId');
            assert.property(res.body, '_id');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');

            done();

        });

    });

    test('POST /api/issues/{project} create an issue with required fields', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'issue_title', issue.issue_title);
            assert.propertyVal(res.body, 'issue_text', issue.issue_text);
            assert.propertyVal(res.body, 'created_by', issue.created_by);
            assert.propertyVal(res.body, 'assigned_to', '');
            assert.propertyVal(res.body, 'status_text', '');
            assert.propertyVal(res.body, 'open', true);
            assert.property(res.body, 'projectId');
            assert.property(res.body, '_id');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');

            done();

        });

    });

    test('POST /api/issues/{project} create an issue without required fields', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.assigned_to }`)
        .send(`issue_title=${ issue.status_text }`)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'error', 'required field(s) missing');

            done();

        });

    });

    test('GET /api/issues/{project} view a projects issues', (done) => {

        chai.request(server)
        .get(`/api/issues/${ project }`)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            
            const issues = res.body

            issues.forEach(issue => {

                assert.property(issue, 'issue_title');
                assert.property(issue, 'issue_text');
                assert.property(issue, 'created_by');
                assert.property(issue, 'assigned_to');
                assert.property(issue, 'status_text');
                assert.property(issue, 'open');
                assert.property(issue, 'projectId');
                assert.property(issue, '_id');
                assert.property(issue, 'created_on');
                assert.property(issue, 'updated_on');

            });

            done();

        });

    });

    test('GET /api/issues/{project}?open=true view a projects open issues', (done) => {

        chai.request(server)
        .get(`/api/issues/${ project }`)
        .query(openFilter)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');

            const issues = res.body

            issues.forEach(issue => {

                assert.property(issue, 'issue_title');
                assert.property(issue, 'issue_text');
                assert.property(issue, 'created_by');
                assert.property(issue, 'assigned_to');
                assert.property(issue, 'status_text');
                assert.propertyVal(issue, 'open', true);
                assert.property(issue, 'projectId');
                assert.property(issue, '_id');
                assert.property(issue, 'created_on');
                assert.property(issue, 'updated_on');

            });


            done();

        });

    });

    test('GET /api/issues/{project}?open=true&status=development view a projects open issues in development', (done) => {

        chai.request(server)
        .get(`/api/issues/${ project }`)
        .query(openFilter)
        .query(statusFilter)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');

            const issues = res.body

            issues.forEach(issue => {

                assert.property(issue, 'issue_title');
                assert.property(issue, 'issue_text');
                assert.property(issue, 'created_by');
                assert.property(issue, 'assigned_to');
                assert.property(issue, 'status_text', 'development');
                assert.propertyVal(issue, 'open', true);
                assert.property(issue, 'projectId');
                assert.property(issue, '_id');
                assert.property(issue, 'created_on');
                assert.property(issue, 'updated_on');

            });

            done();

        });

    });

    test('PUT /api/issues/{project} update one field on an issue', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            chai.request(server)
            .put(`/api/issues/${ project }`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send(`_id=${ res.body._id }`)
            .send(`issue_text=${ updateIssueText }`)
            .end((err, res) => {

                if (err) console.log(err);

                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.propertyVal(res.body, 'result', 'successfully updated');
                assert.propertyVal(res.body, '_id', res.body._id);

                done();

            });


        });

    });

    test('PUT /api/issues/{project} update multiple fields on an issue', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            chai.request(server)
            .put(`/api/issues/${ project }`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send(`_id=${ res.body._id }`)
            .send(`issue_text=${ updateIssueText }`)
            .send(`assigned_to=${ updateAssignedTo }`)
            .end((err, res) => {

                if (err) console.log(err);

                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.propertyVal(res.body, 'result', 'successfully updated');
                assert.propertyVal(res.body, '_id', res.body._id);

                done();

            });


        });

    });

    test('PUT /api/issues/{project} update an issue without _id', (done) => {

        chai.request(server)
        .put(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_text=${ updateIssueText }`)
        .send(`issue_text=${ updateAssignedTo }`)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'error', 'missing _id');

            done();

        });

    });

    test('PUT /api/issues/{project} update an issue without any fields', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            chai.request(server)
            .put(`/api/issues/${ project }`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send(`_id=${ res.body._id }`)
            .end((err, res) => {

                if (err) console.log(err);

                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.propertyVal(res.body, 'error', 'no update field(s) sent');
                assert.propertyVal(res.body, '_id', res.body._id);

                done();

            });


        });

    });

    test('PUT /api/issues/{project} update an issue with invalid _id', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            chai.request(server)
            .put(`/api/issues/${ project }`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send(`_id=${ invalidId }`)
            .send(`issue_text=${ updateIssueText }`)
            .send(`assigned_to=${ updateAssignedTo }`)
            .end((err, res) => {
    
                if (err) console.log(err);
    
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.propertyVal(res.body, 'error', 'could not update');
                assert.propertyVal(res.body, '_id', invalidId);
                
                done();
    
            });

        });

    });

    test('DELETE /api/issues/{project} delete an issue', (done) => {

        chai.request(server)
        .post(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`issue_title=${ issue.issue_title }`)
        .send(`issue_text=${ issue.issue_text }`)
        .send(`created_by=${ issue.created_by }`)
        .end((err, res) => {

            if (err) console.log(err);

            chai.request(server)
            .delete(`/api/issues/${ project }`)
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send(`_id=${ res.body._id }`)
            .end((err, res) => {

                if (err) console.log(err);

                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.propertyVal(res.body, 'result', 'successfully deleted');
                assert.propertyVal(res.body, '_id', res.body._id);

                done();

            });


        });

    });

    test('DELETE /api/issues/{project} delete an issue with invalid _id', (done) => {

        chai.request(server)
        .delete(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(`_id=${ invalidId }`)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'error', 'could not delete');
            assert.propertyVal(res.body, '_id', invalidId);

            done();

        });

    });

    test('DELETE /api/issues/{project} delete an issue with missing _id', (done) => {

        chai.request(server)
        .delete(`/api/issues/${ project }`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .type('form')
        .send(``)
        .end((err, res) => {

            if (err) console.log(err);

            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.propertyVal(res.body, 'error', 'missing _id');

            done();

        });

    });

});