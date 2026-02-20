# Webhook payload
Example webhook payloads to follow

## Rolling release started

--- Rolling release webhook ---
Time: 2026-02-20T03:09:39.426Z
Method: POST
Path: /webhook
Body:
{
  "id": "WwIXQdLuyI11kJBq3Wkmr",
  "payload": {
    "user": {
      "id": "UvNgGoCUvukoUUTO9WSsVMNy"
    },
    "team": {
      "id": "team_S5XzLRwjjgoSIu8i1giOZOXS"
    },
    "project": {
      "id": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5"
    },
    "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
    "projectName": "rr-front",
    "userId": "UvNgGoCUvukoUUTO9WSsVMNy",
    "rollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5"
      ],
      "state": "ACTIVE",
      "activeStageIndex": 0,
      "default": {
        "baseDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetPercentage": 10,
        "targetStartAt": 1771556979212,
        "targetUpdatedAt": 1771556979213
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "deployment-ready"
    },
    "prevRollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Coxcp1VoQz1u39nPKXwmwSP1ULS2",
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi"
      ],
      "state": "COMPLETE",
      "activeStageIndex": 1,
      "default": {
        "baseDeploymentId": "dpl_Coxcp1VoQz1u39nPKXwmwSP1ULS2",
        "targetDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetPercentage": 100,
        "targetStartAt": 1771556271276,
        "targetUpdatedAt": 1771556718361
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "finalize-rolling-release"
    }
  },
  "createdAt": 1771556979270,
  "type": "project.rolling-release.started"
}
---


## Rolling release approved


--- Rolling release webhook ---
Time: 2026-02-20T03:11:02.454Z
Method: POST
Path: /webhook
Body:
{
  "id": "mtXTSAyOzIFCpeNRe9yPz",
  "payload": {
    "user": {
      "id": "UvNgGoCUvukoUUTO9WSsVMNy"
    },
    "team": {
      "id": "team_S5XzLRwjjgoSIu8i1giOZOXS"
    },
    "project": {
      "id": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5"
    },
    "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
    "projectName": "rr-front",
    "userId": "UvNgGoCUvukoUUTO9WSsVMNy",
    "rollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5"
      ],
      "state": "ACTIVE",
      "activeStageIndex": 1,
      "default": {
        "baseDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetPercentage": 35,
        "targetStartAt": 1771556979212,
        "targetUpdatedAt": 1771557062235
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "stage-1-approval"
    },
    "prevRollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5"
      ],
      "state": "ACTIVE",
      "activeStageIndex": 0,
      "default": {
        "baseDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetPercentage": 10,
        "targetStartAt": 1771556979212,
        "targetUpdatedAt": 1771556979213
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "deployment-ready"
    }
  },
  "createdAt": 1771557062301,
  "type": "project.rolling-release.approved"
}
---

## Rolling release completed

2026-02-20 03:12:41.301 [info] --- Rolling release webhook ---
Time: 2026-02-20T03:12:41.298Z
Method: POST
Path: /webhook
Body:
{
  "id": "isx9Am5_qJFWhGwEORBjG",
  "payload": {
    "user": {
      "id": "UvNgGoCUvukoUUTO9WSsVMNy"
    },
    "team": {
      "id": "team_S5XzLRwjjgoSIu8i1giOZOXS"
    },
    "project": {
      "id": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5"
    },
    "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
    "projectName": "rr-front",
    "userId": "UvNgGoCUvukoUUTO9WSsVMNy",
    "rollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5"
      ],
      "state": "COMPLETE",
      "activeStageIndex": 2,
      "default": {
        "baseDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetPercentage": 100,
        "targetStartAt": 1771556979212,
        "targetUpdatedAt": 1771557161114
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "finalize-rolling-release"
    },
    "prevRollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5"
      ],
      "state": "ACTIVE",
      "activeStageIndex": 1,
      "default": {
        "baseDeploymentId": "dpl_Eejm21eScdLF3fFQBeEu95CkFsAi",
        "targetDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetPercentage": 35,
        "targetStartAt": 1771556979212,
        "targetUpdatedAt": 1771557062235
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "stage-1-approval"
    }
  },
  "createdAt": 1771557161165,
  "type": "project.rolling-release.completed"
}
---

## Rolling release aborted

--- Rolling release webhook ---
Time: 2026-02-20T03:15:03.815Z
Method: POST
Path: /webhook
Body:
{
  "id": "80JDzBVfQh4G_gYjPRJUZ",
  "payload": {
    "user": {
      "id": "UvNgGoCUvukoUUTO9WSsVMNy"
    },
    "team": {
      "id": "team_S5XzLRwjjgoSIu8i1giOZOXS"
    },
    "project": {
      "id": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5"
    },
    "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
    "projectName": "rr-front",
    "userId": "UvNgGoCUvukoUUTO9WSsVMNy",
    "rollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "dpl_7ZftCjzKrnXpvdGKXS68pHVBeQXb"
      ],
      "state": "ABORTED",
      "activeStageIndex": 0,
      "default": {
        "baseDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetDeploymentId": "dpl_7ZftCjzKrnXpvdGKXS68pHVBeQXb",
        "targetStartAt": 1771557161167,
        "targetUpdatedAt": 1771557303576
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "assign-alias"
    },
    "prevRollingRelease": {
      "projectId": "prj_NAZjH7EiEEHohNEqCvZUEsikFHA5",
      "ownerId": "team_S5XzLRwjjgoSIu8i1giOZOXS",
      "deploymentIds": [
        "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "dpl_7ZftCjzKrnXpvdGKXS68pHVBeQXb"
      ],
      "state": "ACTIVE",
      "activeStageIndex": 0,
      "default": {
        "baseDeploymentId": "dpl_CVTmXmqSU3qAnijygSKu81xuZgM5",
        "targetDeploymentId": "dpl_7ZftCjzKrnXpvdGKXS68pHVBeQXb",
        "targetPercentage": 10,
        "targetStartAt": 1771557161167,
        "targetUpdatedAt": 1771557161167
      },
      "config": {
        "target": "production",
        "stages": [
          {
            "targetPercentage": 10,
            "requireApproval": true
          },
          {
            "targetPercentage": 35,
            "requireApproval": true
          },
          {
            "targetPercentage": 100
          }
        ]
      },
      "writtenBy": "completion-and-auto-advance"
    }
  },
  "createdAt": 1771557303650,
  "type": "project.rolling-release.aborted"
}
---


