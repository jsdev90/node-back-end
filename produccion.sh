#!/bin/bash
forever stop backend
export ORIGIN=http://beta.firelabinc.com,http://newsite.firelabinc.com,http://test-beta.firelabinc.com,http://test-newsite.firelabinc.com
export AWS_ACCESS_KEY_ID=AKIAIWTRN7JFVBJYIYAA
export AWS_SECRET_ACCESS_KEY=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
export NOTIFICATION_EMAIL=no-reply@firelabinc.com
forever start -a --uid "backend" /software/backend/src
