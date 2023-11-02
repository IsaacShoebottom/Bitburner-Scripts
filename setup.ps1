if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]'Administrator'))
{
    $CommandLine = "-c cd '$pwd'; & `"" + $MyInvocation.MyCommand.Path + "`""
    Start-Process powershell -Verb runas -ArgumentList $CommandLine
    exit
}

# Folder handle for the submodule src folder
$srcFolder = "typescript-template\src\"

# Init git submodules
git submodule update --init --recursive
# Check if submodule src folder exists
if (!(Test-Path $srcFolder))
{
    Write-Host "No submodule src folder found"
    # Make a link from the src folder to the submodule src folder
    New-Item -ItemType SymbolicLink -Path $srcFolder -Target src
}
elseif ((Get-Item $srcFolder).Attributes -match 'ReparsePoint')
{
    Write-Host "Submodule src folder is a soft link"
    # Remove the soft link
    Remove-Item $srcFolder -Recurse

    # Make a link from the src folder to the submodule src folder
    New-Item -ItemType SymbolicLink -Path $srcFolder -Target src
}
else
{
    Write-Host "Submodule src folder is newly created"
    # Remove the src folder
    Remove-Item $srcFolder -Recurse

    # Make a link from the src folder to the submodule src folder
    New-Item -ItemType SymbolicLink -Path $srcFolder -Target src
}
# Add Read-Host to see the output