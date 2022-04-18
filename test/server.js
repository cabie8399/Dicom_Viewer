import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

const protocol = 'https:';
const hostname = '0.0.0.0';
const port = 443;

const serverOption = {
    key: fs.readFileSync('key.pem', 'utf-8'),
    cert: fs.readFileSync('cert.pem', 'utf-8'),
};

const rootPath = 'public';
const app = express();
app.use(express.json());
app.use(express.static(rootPath));
app.use('/dicom', express.static('test/dicom'));

const server = {
    get 'http:'() {
        return http.createServer(app);
    },
    get 'https:'() {
        return https.createServer(serverOption, app);
    },
}[protocol];

server.listen(port, hostname, () => {
    console.log(`running ${protocol}//${hostname}:${port}`);
});

// #region users
app.post('/api/users/login', (req, res) => {
    const {
        account,
        password,
    } = req.body;

    if (account !== 'admin' || password !== 'admin') {
        res.status(401);
        res.send();
        return;
    }

    const data = {
        'access_token': 'testtesttesttesttesttest',
    };
    res.send(data);
});

app.get('/api/users/login', (req, res) => {
    res.send();
});

app.post('/api/users/logout', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.get('/api/users', (req, res) => {
    const data = {
        wwwc_shortcut: JSON.stringify([
            {
                name: 'Brain',
                ww: 80,
                wc: 40,
            },
            {
                name: 'Heart',
                ww: 40,
                wc: 80,
            },
        ]),
    };
    res.send(data);
});

app.put('/api/users', (req, res) => {
    res.status(200);
    res.send();
});
// #endregion

// #region study
app.post('/api/study/:id/export', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.get('/api/study', (req, res) => {
    const data = [
        {
            "description": "General study",
            "id": 1,
            "institution_name": "HCH",
            "patient_age": "60-65",
            "patient_id": 999999,
            "patient_name": "\u6e2c\u8a66\u7528case",
            "patient_sex": "Female",
            "status": "preview",
            "note": "hello world",
            "series": [
                {
                    "body_part": "HEAD",
                    "create_time": "2021-11-03T02:15:29Z",
                    "description": "series1\u63cf\u8ff0",
                    "id": 11,
                    "instances": 33,
                    "modality": "CT",
                    "series_number": "1",
                    "series_time": "2021-11-03T10:15:29",
                    "series_uid": "1.789.987.778899.1",
                    "thumbnail_image_url": "/dicom/study1/1/1.jpg",
                    "update_time": "2021-11-03T02:15:29Z",
                },
                {
                    "body_part": "LEG",
                    "create_time": "2021-11-13T02:15:29Z",
                    "description": "series2\u63cf\u8ff0",
                    "id": 12,
                    "instances": 28,
                    "modality": "CT",
                    "series_number": "2",
                    "series_time": "2021-11-13T10:15:29",
                    "series_uid": "1.789.987.778899.2",
                    "thumbnail_image_url": "/dicom/study1/2/2.jpg",
                    "update_time": "2021-11-13T02:15:29Z",
                },
            ],
            "study_time": "2021-12-03T10:15:29",
            "thumbnail_image_url": "/dicom/study1/1/1.jpg",
            "update_time": "2021-12-03T02:15:29Z",
        },
        {
            "description": "Multiframe study",
            "id": 2,
            "institution_name": "HCH",
            "patient_age": "60-65",
            "patient_id": 2222222,
            "patient_name": "\u6e2c\u8a66\u7528case",
            "patient_sex": "Female",
            "status": "completed",
            "note": null,
            "series": [
                {
                    "body_part": "HEAD",
                    "create_time": "2021-11-03T02:15:29Z",
                    "description": "series1\u63cf\u8ff0",
                    "id": 21,
                    "instances": 33,
                    "modality": "CT",
                    "series_number": "1",
                    "series_time": "2021-11-03T10:15:29",
                    "series_uid": "1.789.987.778899.1",
                    "thumbnail_image_url": "/dicom/study2/1/multi-frame.jpg",
                    "update_time": "2021-11-03T02:15:29Z",
                },
                {
                    "body_part": "LEG",
                    "create_time": "2021-11-13T02:15:29Z",
                    "description": "series2\u63cf\u8ff0",
                    "id": 22,
                    "instances": 28,
                    "modality": "CT",
                    "series_number": "2",
                    "series_time": "2021-11-13T10:15:29",
                    "series_uid": "1.789.987.778899.2",
                    "thumbnail_image_url": "/dicom/study2/2/2.jpg",
                    "update_time": "2021-11-13T02:15:29Z",
                },
            ],
            "study_time": "2021-12-03T10:15:29",
            "thumbnail_image_url": "/dicom/study2/1/multi-frame.jpg",
            "update_time": "2021-12-03T02:15:29Z",
        },
    ];
    res.send(data);
});

app.delete('/api/study', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.put('/api/study', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.get('/api/study/:id/report', (req, res) => {
    const data = {
        "content": "i am a report content",
    };
    res.send(data);
});

app.get('/api/study/:id/series', (req, res) => {
    const {
        params: {
            id,
        },
        query: {
            shareToken,
        },
    } = req;

    const data = {
        1: [
            {
                series_id: 11,
                first_dicom_url: '/dicom/study1/1/1.jpg',
            },
            {
                series_id: 12,
                first_dicom_url: '/dicom/study1/2/2.jpg',
            },
            {
                series_id: 13,
                first_dicom_url: '/dicom/study1/1/3.jpg',
            },
        ],
        2: [
            {
                series_id: 21,
                first_dicom_url: '/dicom/study2/1/multi-frame.jpg',
            },
            {
                series_id: 22,
                first_dicom_url: '/dicom/study2/2/2.jpg',
            },
        ],
    }[id];
    res.send(data);
});

app.put('/api/study/:id/report', (req, res) => {
    const { shareToken } = req.query;
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.post('/api/study/:id/share', (req, res) => {
    const data = {
        share_token: 'testtesttesttesttesttesttesttesttesttesttest',
    };
    res.send(data);
});

app.get('/api/study/share_status', (req, res) => {
    const { share_token } = req.query;
    const isValid = share_token === "testtesttesttesttesttesttesttesttesttesttest";

    if (isValid) {
        res.status(200);
        res.send();
        return;
    }

    res.status(403);
    res.send();
});
// #endregion

// #region series
app.get('/api/series/:id', (req, res) => {
    const { shareToken } = req.query;
    const { id } = req.params;

    const data = {
        11: [
            {
                'image_url': '/dicom/study1/1/1.dcm',
                "instance": 1,
                'is_favorite': false,
            },
            {
                'image_url': '/dicom/study1/1/2.dcm',
                "instance": 2,
                'is_favorite': true,
            },
            {
                'image_url': '/dicom/study1/1/3.dcm',
                "instance": 3,
                'is_favorite': false,
            },
        ],
        12: [
            {
                'image_url': '/dicom/study1/2/2.dcm',
                "instance": 2,
                'is_favorite': false,
            },
            {
                'image_url': '/dicom/study1/2/3.dcm',
                "instance": 3,
                'is_favorite': true,
            },
            {
                'image_url': '/dicom/study1/2/1.dcm',
                "instance": 1,
                'is_favorite': false,
            },
        ],
        21: [
            {
                'image_url': '/dicom/study2/1/multi-frame.dcm',
                "instance": 28,
                'is_favorite': false,
            },
            {
                'image_url': '/dicom/study2/1/2.dcm',
                "instance": 1,
                'is_favorite': false,
            },
        ],
        22: [
            {
                'image_url': '/dicom/study2/2/2.dcm',
                "instance": 1,
                'is_favorite': false,
            },
            {
                'image_url': '/dicom/study2/2/multi-frame.dcm',
                "instance": 28,
                'is_favorite': false,
            },
        ],
    }[id];

    setTimeout(() => {
        res.send(data);
    }, 2_000);
});

app.post('/api/series', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.delete('/api/series', (req, res) => {
    const data = {
        msg: 'success',
    };
    res.send(data);
});

app.put('/api/series/:id/favorite', (req, res) => {
    const { Instance } = req.query;
    const data = {
        "msg": "add series favorite successful",
    };
    res.send(data);
});
// #endregion

// SPA
app.get('*', (req, res) => {
    res.sendFile(
        '/index.html',
        { root: rootPath },
    );
});
