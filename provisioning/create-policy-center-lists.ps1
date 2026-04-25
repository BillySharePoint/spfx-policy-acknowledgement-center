# Policy Center - Lists Provisioning Script
# This script creates the required SharePoint lists for the SPFx Policy Acknowledgement Center.
# Requires PnP PowerShell module: Install-Module PnP.PowerShell
#
# Usage:
#   Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite" -Interactive
#   .\create-policy-center-lists.ps1

param(
    [string]$SiteUrl = "",
    [switch]$CreateSampleData
)

# Connect if URL provided
if ($SiteUrl) {
    Connect-PnPOnline -Url $SiteUrl -Interactive
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Policy Center - List Provisioning" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------
# List 1: Policy Center - Policies
# ---------------------------------------------------
$policiesListName = "Policy Center - Policies"

Write-Host "Creating list: $policiesListName..." -ForegroundColor Yellow

$policiesList = Get-PnPList -Identity $policiesListName -ErrorAction SilentlyContinue
if ($null -eq $policiesList) {
    New-PnPList -Title $policiesListName -Template GenericList -Url "PolicyCenterPolicies"
    Write-Host "  List created." -ForegroundColor Green
}
else {
    Write-Host "  List already exists. Skipping creation." -ForegroundColor Gray
}

# Add fields to Policies list
Write-Host "  Adding fields..." -ForegroundColor Yellow

$policyFields = @(
    @{ DisplayName = "Policy ID"; InternalName = "PolicyId"; Type = "Text"; Required = $true },
    @{ DisplayName = "Description"; InternalName = "PolicyDescription"; Type = "Note"; Required = $false },
    @{ DisplayName = "Category"; InternalName = "PolicyCategory"; Type = "Choice"; Required = $true;
        Choices = @("HR", "IT", "Security", "Compliance", "Operations", "Finance", "Legal", "Facilities", "Other") 
    },
    @{ DisplayName = "Version"; InternalName = "PolicyVersion"; Type = "Text"; Required = $true },
    @{ DisplayName = "Policy Document URL"; InternalName = "PolicyDocumentUrl"; Type = "URL"; Required = $false },
    @{ DisplayName = "Required"; InternalName = "IsRequired"; Type = "Boolean"; Required = $false },
    @{ DisplayName = "Active"; InternalName = "IsActive"; Type = "Boolean"; Required = $false },
    @{ DisplayName = "Due Date"; InternalName = "DueDate"; Type = "DateTime"; Required = $false },
    @{ DisplayName = "Effective Date"; InternalName = "EffectiveDate"; Type = "DateTime"; Required = $false },
    @{ DisplayName = "Expiry Date"; InternalName = "ExpiryDate"; Type = "DateTime"; Required = $false },
    @{ DisplayName = "Acknowledgement Text"; InternalName = "AcknowledgementText"; Type = "Note"; Required = $false },
    @{ DisplayName = "Sort Order"; InternalName = "SortOrder"; Type = "Number"; Required = $false }
)

foreach ($field in $policyFields) {
    $existing = Get-PnPField -List $policiesListName -Identity $field.InternalName -ErrorAction SilentlyContinue
    if ($null -eq $existing) {
        if ($field.Type -eq "Choice") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Choice -Choices $field.Choices -Required:$field.Required
        }
        elseif ($field.Type -eq "Note") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Note -Required:$field.Required
        }
        elseif ($field.Type -eq "URL") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type URL -Required:$field.Required
        }
        elseif ($field.Type -eq "Boolean") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Boolean
        }
        elseif ($field.Type -eq "DateTime") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type DateTime -Required:$field.Required
        }
        elseif ($field.Type -eq "Number") {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Number -Required:$field.Required
        }
        else {
            Add-PnPField -List $policiesListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Text -Required:$field.Required
        }
        Write-Host "    Added: $($field.DisplayName)" -ForegroundColor Green
    }
    else {
        Write-Host "    Exists: $($field.DisplayName)" -ForegroundColor Gray
    }
}

# Add Target Departments (Multi-Choice)
$tdField = Get-PnPField -List $policiesListName -Identity "TargetDepartments" -ErrorAction SilentlyContinue
if ($null -eq $tdField) {
    $targetDeptXml = '<Field Type="MultiChoice" DisplayName="Target Departments" Required="FALSE" FillInChoice="TRUE" StaticName="TargetDepartments" Name="TargetDepartments"><CHOICES><CHOICE>All</CHOICE><CHOICE>Human Resources</CHOICE><CHOICE>Information Technology</CHOICE><CHOICE>Finance</CHOICE><CHOICE>Operations</CHOICE><CHOICE>Sales</CHOICE><CHOICE>Marketing</CHOICE><CHOICE>Legal</CHOICE><CHOICE>Executive</CHOICE><CHOICE>Other</CHOICE></CHOICES></Field>'
    Add-PnPFieldFromXml -List $policiesListName -FieldXml $targetDeptXml
    Write-Host "    Added: Target Departments (MultiChoice)" -ForegroundColor Green
}
else {
    Write-Host "    Exists: Target Departments" -ForegroundColor Gray
}

# Add Policy Owner (Person field)
$ownerField = Get-PnPField -List $policiesListName -Identity "PolicyOwner" -ErrorAction SilentlyContinue
if ($null -eq $ownerField) {
    Add-PnPField -List $policiesListName -DisplayName "Policy Owner" -InternalName "PolicyOwner" -Type User
    Write-Host "    Added: Policy Owner" -ForegroundColor Green
}
else {
    Write-Host "    Exists: Policy Owner" -ForegroundColor Gray
}

Write-Host ""

# ---------------------------------------------------
# List 2: Policy Center - Acknowledgements
# ---------------------------------------------------
$ackListName = "Policy Center - Acknowledgements"

Write-Host "Creating list: $ackListName..." -ForegroundColor Yellow

$ackList = Get-PnPList -Identity $ackListName -ErrorAction SilentlyContinue
if ($null -eq $ackList) {
    New-PnPList -Title $ackListName -Template GenericList -Url "PolicyCenterAcknowledgements"
    Write-Host "  List created." -ForegroundColor Green
}
else {
    Write-Host "  List already exists. Skipping creation." -ForegroundColor Gray
}

# Add fields to Acknowledgements list
Write-Host "  Adding fields..." -ForegroundColor Yellow

$ackFields = @(
    @{ DisplayName = "Policy Title Snapshot"; InternalName = "PolicyTitleSnapshot"; Type = "Text"; Required = $true },
    @{ DisplayName = "Policy Version"; InternalName = "PolicyVersion"; Type = "Text"; Required = $true },
    @{ DisplayName = "Employee Email"; InternalName = "EmployeeEmail"; Type = "Text"; Required = $true },
    @{ DisplayName = "Employee Display Name"; InternalName = "EmployeeDisplayName"; Type = "Text"; Required = $true },
    @{ DisplayName = "Department"; InternalName = "Department"; Type = "Text"; Required = $false },
    @{ DisplayName = "Job Title"; InternalName = "JobTitle"; Type = "Text"; Required = $false },
    @{ DisplayName = "Acknowledged Date"; InternalName = "AcknowledgedDate"; Type = "DateTime"; Required = $true },
    @{ DisplayName = "Acknowledgement Status"; InternalName = "AcknowledgementStatus"; Type = "Choice"; Required = $true;
        Choices = @("Acknowledged", "Superseded", "Revoked") 
    },
    @{ DisplayName = "Due Date Snapshot"; InternalName = "DueDateSnapshot"; Type = "DateTime"; Required = $false },
    @{ DisplayName = "Comments"; InternalName = "Comments"; Type = "Note"; Required = $false }
)

foreach ($field in $ackFields) {
    $existing = Get-PnPField -List $ackListName -Identity $field.InternalName -ErrorAction SilentlyContinue
    if ($null -eq $existing) {
        if ($field.Type -eq "Choice") {
            Add-PnPField -List $ackListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Choice -Choices $field.Choices -Required:$field.Required
        }
        elseif ($field.Type -eq "Note") {
            Add-PnPField -List $ackListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Note -Required:$field.Required
        }
        elseif ($field.Type -eq "DateTime") {
            Add-PnPField -List $ackListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type DateTime -Required:$field.Required
        }
        else {
            Add-PnPField -List $ackListName -DisplayName $field.DisplayName -InternalName $field.InternalName -Type Text -Required:$field.Required
        }
        Write-Host "    Added: $($field.DisplayName)" -ForegroundColor Green
    }
    else {
        Write-Host "    Exists: $($field.DisplayName)" -ForegroundColor Gray
    }
}

# Add Employee (Person field)
$empField = Get-PnPField -List $ackListName -Identity "Employee" -ErrorAction SilentlyContinue
if ($null -eq $empField) {
    Add-PnPField -List $ackListName -DisplayName "Employee" -InternalName "Employee" -Type User
    Write-Host "    Added: Employee" -ForegroundColor Green
}
else {
    Write-Host "    Exists: Employee" -ForegroundColor Gray
}

# Add PolicyLookup (Lookup field)
$lookupField = Get-PnPField -List $ackListName -Identity "PolicyLookup" -ErrorAction SilentlyContinue
if ($null -eq $lookupField) {
    $policiesListId = (Get-PnPList -Identity $policiesListName).Id
    $lookupXml = "<Field Type='Lookup' DisplayName='Policy' List='{$policiesListId}' ShowField='Title' StaticName='PolicyLookup' Name='PolicyLookup' Required='TRUE' />"
    Add-PnPFieldFromXml -List $ackListName -FieldXml $lookupXml
    Write-Host "    Added: PolicyLookup" -ForegroundColor Green
}
else {
    Write-Host "    Exists: PolicyLookup" -ForegroundColor Gray
}

Write-Host ""

# ---------------------------------------------------
# Sample Data (Optional)
# ---------------------------------------------------
if ($CreateSampleData) {
    Write-Host "Creating sample data..." -ForegroundColor Yellow

    $samplePolicies = @(
        @{
            Title             = "Information Security Policy"
            PolicyId          = "POL-SEC-001"
            PolicyDescription = "Defines employee responsibilities for protecting company information and systems."
            PolicyCategory    = "Security"
            PolicyVersion     = "1.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(60)
            SortOrder         = 1
        },
        @{
            Title             = "Remote Work Policy"
            PolicyId          = "POL-HR-001"
            PolicyDescription = "Explains expectations, eligibility, and security requirements for remote work."
            PolicyCategory    = "HR"
            PolicyVersion     = "2.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(30)
            SortOrder         = 2
        },
        @{
            Title             = "AI Usage Policy"
            PolicyId          = "POL-IT-001"
            PolicyDescription = "Provides guidelines for responsible use of generative AI tools in the workplace."
            PolicyCategory    = "IT"
            PolicyVersion     = "1.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(75)
            SortOrder         = 3
        },
        @{
            Title             = "Data Handling and Classification Policy"
            PolicyId          = "POL-SEC-002"
            PolicyDescription = "Outlines how to classify, handle, and protect company and customer data."
            PolicyCategory    = "Security"
            PolicyVersion     = "1.1"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(45)
            SortOrder         = 4
        },
        @{
            Title             = "Code of Conduct"
            PolicyId          = "POL-HR-002"
            PolicyDescription = "Establishes ethical standards and expected behavior for all employees."
            PolicyCategory    = "HR"
            PolicyVersion     = "3.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(90)
            SortOrder         = 5
        },
        @{
            Title             = "Acceptable Use Policy"
            PolicyId          = "POL-IT-002"
            PolicyDescription = "Defines acceptable use of company IT resources including computers, networks, and software."
            PolicyCategory    = "IT"
            PolicyVersion     = "2.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(60)
            SortOrder         = 6
        },
        @{
            Title             = "Records Retention Policy"
            PolicyId          = "POL-COMP-001"
            PolicyDescription = "Specifies how long business records must be retained and guidelines for disposal."
            PolicyCategory    = "Compliance"
            PolicyVersion     = "1.0"
            IsRequired        = $false
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(120)
            SortOrder         = 7
        },
        @{
            Title             = "Workplace Safety Procedures"
            PolicyId          = "POL-OPS-001"
            PolicyDescription = "Outlines safety procedures, emergency protocols, and workplace hazard reporting."
            PolicyCategory    = "Operations"
            PolicyVersion     = "1.0"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(14)
            SortOrder         = 8
        },
        @{
            Title             = "Privacy Policy"
            PolicyId          = "POL-LEGAL-001"
            PolicyDescription = "Describes how the organization collects, uses, and protects personal data."
            PolicyCategory    = "Legal"
            PolicyVersion     = "2.1"
            IsRequired        = $true
            IsActive          = $true
            DueDate           = (Get-Date).AddDays(30)
            SortOrder         = 9
        },
        @{
            Title             = "Travel and Expense Policy"
            PolicyId          = "POL-FIN-001"
            PolicyDescription = "Guidelines for business travel, expense reporting, and reimbursement procedures."
            PolicyCategory    = "Finance"
            PolicyVersion     = "1.0"
            IsRequired        = $false
            IsActive          = $true
            DueDate           = $null
            SortOrder         = 10
        }
    )

    foreach ($policy in $samplePolicies) {
        $values = @{
            "Title"             = $policy.Title
            "PolicyId"          = $policy.PolicyId
            "PolicyDescription" = $policy.PolicyDescription
            "PolicyCategory"    = $policy.PolicyCategory
            "PolicyVersion"     = $policy.PolicyVersion
            "IsRequired"        = $policy.IsRequired
            "IsActive"          = $policy.IsActive
            "SortOrder"         = $policy.SortOrder
        }

        if ($null -ne $policy.DueDate) {
            $values["DueDate"] = $policy.DueDate
        }

        Add-PnPListItem -List $policiesListName -Values $values
        Write-Host "  Added policy: $($policy.Title)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Provisioning complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lists created:" -ForegroundColor White
Write-Host "  - $policiesListName" -ForegroundColor White
Write-Host "  - $ackListName" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add the web parts to a SharePoint page" -ForegroundColor White
Write-Host "  2. Configure list names in web part properties" -ForegroundColor White
Write-Host "  3. Add policies to the Policies list" -ForegroundColor White
Write-Host ""
