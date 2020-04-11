<!DOCTYPE html>
<html lang="en">
<title>Proxy</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">
<!--    <link rel="shortcut icon" type="image/png" href="/favicon.ico"/>-->
<link href="/css/all.css" rel="stylesheet">
<link rel="stylesheet" href="/css/bootstrap.css">
</html>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <table id="device-list" class="table table-bordered table-striped table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>IP</th>
                    <th>Proxy</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colspan="4">Loading...</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script src="/js/jquery.js"></script>
<script src="/js/popper.js"></script>
<script src="/js/bootstrap.js"></script>
<script defer src="/js/lib.js"></script>
<script defer src="/js/app.js"></script>
<script>
    $(document).ready(function () {
        App.init()
    })
</script>
</body>
