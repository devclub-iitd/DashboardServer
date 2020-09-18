/**
 * Contains functions that have to be called when the server/app is started.
 * As a design choice, it is in a different file as these weren't really suitable to
 * be put in either controller or middleware
 */

import {hashPassword} from '../middlewares/auth';
import User from '../models/user';
import {ADMIN_ENTRY, ADMIN_PASS} from '../utils/secrets';

export let ADMIN_ID: string;

// Creates devclub admin user if not already present in DB
const initAdmin = () => {
  hashPassword(ADMIN_PASS)
    .then(hash => {
      const admPassHash = hash;
      User.findOne({
        entry_no: ADMIN_ENTRY,
      })
        .then(doc => {
          if (doc != null) {
            ADMIN_ID = doc._id;
            console.log('Devclub user exists');
            if (doc.get('privelege_level') != 'Admin') {
              console.log('Devclub user is not admin. Making it an admin.');
              doc.set('privelege_level', 'Admin');
              doc
                .save()
                .then(_ => console.log('Devclub user is now an admin'))
                .catch(err => {
                  console.error(err);
                  throw new Error('Unable to make devclub user an admin');
                });
            } else {
              console.log('Devclub user is admin');
            }
            return;
          }
          User.create({
            entry_no: ADMIN_ENTRY,
            password: admPassHash,
            name: 'Devclub IITD',
            privelege_level: 'Admin',
            category: 'Organisation',
            email: 'devclub.iitd@gmail.com',
            url: {
              fb_url: 'https://www.facebook.com/tech.iitd/',
              github_url: 'https://github.com/devclub-iitd',
              picture_url:
                'https://lh3.googleusercontent.com/XdeI1K-O1_E6Rq-JCTxTwwJAfV3SVil9XDnnTYG67_2TIuX4wNBdl1r55cSfCO3fXnxuROgqwiMwr6YDx7g4nhjHaFEk8cx7QyDfuDG-LyF-R0zb8nP24270ehJj-a-AL9i0GvAWy7v6PwZ8JdnENmFXoyxi8e1l5MDzfiD1M8hSQu2PEIEyjDOPqwuidGJHcwt-ii89us8ErPSpFHzhcj3ehdFJd3jdUM90nXYWbYM1_B-5QV7XD-kKHXKmhXyJN8J3vSYnTWAT-NALtYL9s6w5G9WVBqoK3alErvsB0KyHghX3P3GwhjRfj7xs4F6JFvPDn2O3o6WE0vcx2PaJXnVicoiP1ldS3hQa3o_g7zaFLU7RHlSLfAuFhJjLYLpUAuNsvF7_X8h4_ZAXO17lCSGg2pRZnNxO6tsRa4-_w2DJ-N-B7MsOLx3f7P-5EcPyBoraesnl8vXYrIWJtp4_jUuOKYCSBbkVwgzv1EGFPxm3jE_Y2YQKTdmcP2bMr68ZOlCJo5CyKihgd3iQHKXcoI200nieaA-pc88tM5UG0x5LGBuEYWuyH_1A2b1nqqDmy8J5W6-nWpicUNjmts4EcZlkCo_9YQF7p5eKD4Isi7AEfJg4PUUJPuKBeW__yLGXmR2Xg3DIQsqBIl510XL2lGKE9k-wlrf1825lM74sH4fTRH-T5rVRhJldITH9m3OdoApOxkrNVGT0zNZFUAgfavWfAmqoTwobtNVXKDG1MztggsaRq7I9_Gk=w1280-h562-no',
            },
            gender: 'other',
            hometown: 'Delhi',
          })
            .then(doc => {
              ADMIN_ID = doc._id;
              console.log('Devclub admin user created');
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

export default () => {
  initAdmin();
};
