const S3 = require('aws-sdk/clients/s3');

module.exports = {
    getPhotoByContentString(bucketPath) {
        let params = {
            Bucket: process.env.PHOTO_BUCKET,
            Key: bucketPath
        };

        var s3Client = new S3({ apiVersion: "2006-03-01" });

        return s3Client
            .getObject(params)
            .promise()
            .then(resolved => resolved.Body.toString())
            .catch(rejected => {
                console.error("Error getting photo from S3: " + rejected);
                throw("Error getting photo");
            });
    }
};