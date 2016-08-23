angular.module("sync")
    .controller('FolderController', ['$scope', 'Folder', 'User', 'DEBUG', '$stateParams', '$rootScope', 'folderLists', 'cacheFactory', 'Files', function ($scope, Folder, User, DEBUG, $stateParams, $rootScope, folderLists, cacheFactory, Files) {
        $scope.foldes = [
            {
                "id": 21,
                "encrypted_id": "$2y$10$U/.7I7rVaqqk4cbQxWHve.HQgb0Z4P27ZzmVh/tb/bRx1r90923bO",
                "name": "VC",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:23:03",
                "updated_at": "2016-08-21 15:23:03"
            },
            {
                "id": 22,
                "encrypted_id": "$2y$10$kaX.Mfh37tKiiL2mdAhM8eRw2h2aUMDodqgrjnM0.lAFE2Pq1jbUi",
                "name": "VC",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 1,
                "copy_count": 1,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:24:07",
                "updated_at": "2016-08-21 15:24:07"
            },
            {
                "id": 24,
                "encrypted_id": "$2y$10$HjC2OPaSh5ZQPytwVI4Fk.HLRZvrpUQIyhnKdZaBgyEZl4yAIKoO2",
                "name": "bbf",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:26:32",
                "updated_at": "2016-08-21 15:26:32"
            },
            {
                "id": 25,
                "encrypted_id": "$2y$10$HlsFh4L6LATORvCN.FNeA.Km.tSLA0Ynh853/ARIh8Sa6kQ/WGMfm",
                "name": "bbfb",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 15:26:38",
                "updated_at": "2016-08-21 15:26:38"
            },
            {
                "id": 27,
                "encrypted_id": "$2y$10$.E12vRjlzjSPIAHitwElJOc5qCiKQmbHDTlMsxyU75Xerb4Fip42m",
                "name": "01",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 0,
                "copy_count": 0,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 16:19:07",
                "updated_at": "2016-08-21 16:19:08"
            },
            {
                "id": 29,
                "encrypted_id": "$2y$10$LyZbDHjJZhEtDT7p7UYTSeB9E56nDJ4E0R4h/eJ5t368XzXGMb9BG",
                "name": "xc",
                "type": "Folder",
                "size": 0,
                "nested_folder": 1,
                "has_copy": 1,
                "copy_count": 2,
                "user_id": 2,
                "delete_status": "0",
                "forder_privacy": "Private",
                "created_at": "2016-08-21 16:24:17",
                "updated_at": "2016-08-21 16:24:18"
            }
        ];
    }])
    .factory("cacheFactory", function ($cacheFactory) {
        //be cautious with this!
        return $cacheFactory("userData");
    });
