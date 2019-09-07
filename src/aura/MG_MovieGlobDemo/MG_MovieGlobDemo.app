<!--
 - Created by BRITENET on 07.09.2019.
 -->

<aura:application description="MG_MovieGlobDemo" extends="force:slds">
    <lightning:layout horizontalAlign="center" multipleRows="true">
    <lightning:layoutItem size="12">
    <c:MG_LeftSideBar />
    </lightning:layoutItem>
    <lightning:layoutItem size="4">
    <c:MG_RightSideBar />
    </lightning:layoutItem>
    <lightning:layoutItem size="8">
    <c:MG_MainContainer />
    </lightning:layoutItem>
    </lightning:layout>
</aura:application>
