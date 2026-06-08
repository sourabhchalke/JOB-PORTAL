import express from 'express'
import { ChangeJobApplicationsStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js';

const router = express.Router();

//Register a company
router.post('/register',registerCompany);

//Company Login
router.post('/login',loginCompany);

//Get Company Data
router.get('/company',getCompanyData);

//Post a Job
router.post('/post-job',postJob);

//Get Applicants Data of Company
router.get('/applicants',getCompanyJobApplicants);

//Get Company Job List
router.get('/list-job',getCompanyPostedJobs);

//Change Applications Status
router.post('/change-status',ChangeJobApplicationsStatus);

//Change Applications Visiblity
router.post('/change-visiblity',changeVisiblity);

export default router;