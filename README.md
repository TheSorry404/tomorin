# TOMORIN

_This template should help get you started developing with Vue 3 in Vite._

_The Unity-WebGL dependency was wrote in the package lock_

_Need an extra site (nginx or some what) for the Unity WebGL build distribution_
_or OSS/COS address if in need, cause it requests with the client network, so the localhost may not works_

_Used Tailwind CSS(?)_

---

As the MiniLive needs secure connections, the Vite was set only accept https requests, which requires the root folder have a `cert.pem` and `privkey.pem` to encrypt. Here's a way to create a self-signed cert.

```Powershell
$param = @{
    "DnsName" = "YOURDOMAIN";
    "CertStoreLocation" = "Cert:\CurrentUser\My";
    "NotAfter" = (Get-Date).AddYears(10);
    "KeySpec" = "KeyExchange";
    "KeyExportPolicy" = "Exportable";
}
New-SelfSignedCertificate @param

$cert = Get-ChildItem -Path Cert:\CurrentUser\My | Where-Object { $_.DnsNameList -match "YOURDOMAIN" }
Export-PfxCertificate -Cert $cert -FilePath "C:\certificate.pfx" -Password (ConvertTo-SecureString -String "123456" -Force -AsPlainText)

openssl pkcs12 -in C:\certificate.pfx -out C:\certificate.pem -nodes -password pass:123456
```

The cert part is in the generated pem file.
